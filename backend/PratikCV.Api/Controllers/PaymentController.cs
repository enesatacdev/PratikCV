// Shopier Webhook Handler
// Bu dosya backend projesinde Controllers klasörüne eklenmelidir

using Microsoft.AspNetCore.Mvc;
using PratikCV.Application.Services.Interfaces;
using System.Text.Json;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PratikCV.Infrastructure.Settings;

namespace PratikCV.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly ILogger<PaymentController> _logger;
        private readonly IUserService _userService;
        private readonly ShopierSettings _shopierSettings;

        public PaymentController(
            ILogger<PaymentController> logger, 
            IUserService userService,
            IOptions<ShopierSettings> shopierSettings)
        {
            _logger = logger;
            _userService = userService;
            _shopierSettings = shopierSettings.Value;
        }

        [HttpPost("shopier-webhook")]
        public async Task<IActionResult> ShopierWebhook([FromBody] ShopierWebhookModel webhook)
        {
            try
            {
                _logger.LogInformation("Shopier webhook received: {Data}", JsonSerializer.Serialize(webhook));

                // Shopier webhook imzasını doğrula (güvenlik için)
                if (!ValidateShopierSignature(webhook))
                {
                    _logger.LogWarning("Invalid Shopier webhook signature");
                    return BadRequest("Invalid signature");
                }

                // Ödeme durumunu kontrol et
                if (webhook.Status?.ToLower() != "completed" && webhook.Status?.ToLower() != "paid")
                {
                    _logger.LogWarning("Payment not completed. Status: {Status}", webhook.Status);
                    return Ok("Payment not completed");
                }

                // Kullanıcı ID ve plan bilgilerini al
                var userId = webhook.CustomField1;
                var planId = webhook.CustomField2;
                
                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(planId))
                {
                    _logger.LogWarning("Missing user or plan information in webhook");
                    return BadRequest("Missing required fields");
                }

                var creditsToAdd = int.Parse(webhook.CustomField3 ?? "0");

                // Duplicate payment kontrolü
                var existingPayment = await _userService.GetPaymentByTransactionIdAsync(webhook.TransactionId);
                if (existingPayment != null)
                {
                    _logger.LogInformation("Payment already processed: {TransactionId}", webhook.TransactionId);
                    return Ok("Payment already processed");
                }

                // Kullanıcıya premium kredileri ekle
                await _userService.AddPremiumCreditsAsync(userId, creditsToAdd);

                // Ödeme kaydını oluştur
                await _userService.CreatePaymentRecordAsync(new PaymentRecord
                {
                    UserId = userId,
                    PlanId = planId,
                    Credits = creditsToAdd,
                    Amount = webhook.Price,
                    TransactionId = webhook.TransactionId,
                    PaymentDate = DateTime.UtcNow,
                    Status = "completed",
                    PaymentMethod = "shopier",
                    BuyerEmail = webhook.BuyerEmail,
                    BuyerName = webhook.BuyerName
                });

                _logger.LogInformation("Premium credits added successfully. UserId: {UserId}, Credits: {Credits}, TransactionId: {TransactionId}", 
                    userId, creditsToAdd, webhook.TransactionId);

                return Ok("Success");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Shopier webhook");
                return StatusCode(500, "Internal server error");
            }
        }

        private bool ValidateShopierSignature(ShopierWebhookModel webhook)
        {
            // Shopier webhook imza doğrulaması
            // Bu basit bir kontrol, gerçek projede daha güvenli olmalı
            return !string.IsNullOrEmpty(webhook.TransactionId) && !string.IsNullOrEmpty(webhook.BuyerEmail);
        }

        [HttpPost("test-payment")]
        [Authorize]
        public async Task<IActionResult> TestPayment([FromBody] TestPaymentRequest request)
        {
            try
            {
                _logger.LogInformation($"Test payment request for user: {request.UserId}, plan: {request.PlanId}");

                // Test ödeme için plan bilgilerini belirle
                var credits = request.PlanId switch
                {
                    "basic" => 3,
                    "standard" => 10,
                    "pro" => 50,
                    _ => 10
                };

                var amount = request.PlanId switch
                {
                    "basic" => 30m,
                    "standard" => 90m,
                    "pro" => 400m,
                    _ => 90m
                };

                // Test ödeme kaydı oluştur
                var testPaymentRecord = new PaymentRecord
                {
                    UserId = request.UserId,
                    PlanId = request.PlanId,
                    TransactionId = $"test_{DateTime.UtcNow.Ticks}",
                    Credits = credits,
                    Amount = amount,
                    Status = "completed",
                    PaymentMethod = "test",
                    BuyerEmail = request.BuyerEmail ?? "test@example.com",
                    BuyerName = request.BuyerName ?? "Test User",
                    PaymentDate = DateTime.UtcNow
                };

                await _userService.CreatePaymentRecordAsync(testPaymentRecord);
                
                // Kullanıcıya kredi ekle
                await _userService.AddPremiumCreditsAsync(request.UserId, credits);

                _logger.LogInformation($"Test payment processed successfully. Added {credits} credits to user {request.UserId}");

                return Ok(new { 
                    success = true, 
                    credits = credits, 
                    transactionId = testPaymentRecord.TransactionId,
                    message = "Test payment processed successfully" 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error processing test payment for user: {request.UserId}");
                return StatusCode(500, new { success = false, error = "Test payment failed" });
            }
        }

        [HttpPost("confirm-shopier")]
        [Authorize] // JWT token gerekli
        public async Task<IActionResult> ConfirmShopierPayment([FromBody] ConfirmPaymentRequest request)
        {
            try
            {
                // Frontend'den gelen ödeme onayı
                var user = await _userService.GetUserByIdAsync(request.UserId);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                // Transaction ID ile ödeme kontrolü
                var payment = await _userService.GetPaymentByTransactionIdAsync(request.TransactionId);
                if (payment == null)
                {
                    _logger.LogWarning("Payment not found for transaction: {TransactionId}", request.TransactionId);
                    return NotFound("Payment not found");
                }

                if (payment.Status != "completed")
                {
                    return BadRequest("Payment not completed");
                }

                // Kullanıcının güncel kredi bilgisini döndür
                var updatedUser = await _userService.GetUserByIdAsync(request.UserId);
                
                return Ok(new { 
                    success = true, 
                    message = "Payment confirmed",
                    credits = updatedUser.PremiumCredits,
                    transactionId = request.TransactionId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error confirming payment");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("payment-status/{transactionId}")]
        [Authorize]
        public async Task<IActionResult> GetPaymentStatus(string transactionId)
        {
            try
            {
                var payment = await _userService.GetPaymentByTransactionIdAsync(transactionId);
                if (payment == null)
                {
                    return NotFound("Payment not found");
                }

                return Ok(new
                {
                    status = payment.Status,
                    credits = payment.Credits,
                    amount = payment.Amount,
                    paymentDate = payment.PaymentDate
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment status");
                return StatusCode(500, "Internal server error");
            }
        }
    }

    public class ShopierWebhookModel
    {
        public string Status { get; set; }
        public string TransactionId { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; }
        public string ProductName { get; set; }
        public string BuyerName { get; set; }
        public string BuyerEmail { get; set; }
        public string CustomField1 { get; set; } // UserId
        public string CustomField2 { get; set; } // PlanId
        public string CustomField3 { get; set; } // Credits
        public string CustomField4 { get; set; } // User Email
    }

    public class TestPaymentRequest
    {
        public string UserId { get; set; }
        public string PlanId { get; set; }
        public string? BuyerName { get; set; }
        public string? BuyerEmail { get; set; }
    }

    public class ConfirmPaymentRequest
    {
        public string UserId { get; set; }
        public string PlanId { get; set; }
        public int Credits { get; set; }
        public string TransactionId { get; set; }
    }
}
