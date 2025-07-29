using PratikCV.Application.Services.Interfaces;
using PratikCV.Domain.Entities;
using PratikCV.Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace PratikCV.Application.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UserService> _logger;
        private readonly List<PaymentRecord> _paymentRecords; // Geçici olarak memory'de tutuyoruz

        public UserService(IUserRepository userRepository, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
            _paymentRecords = new List<PaymentRecord>();
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning($"User not found with ID: {userId}");
                    throw new ArgumentException($"User not found with ID: {userId}");
                }
                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting user by ID: {userId}");
                throw;
            }
        }

        public async Task AddPremiumCreditsAsync(string userId, int credits)
        {
            try
            {
                var user = await GetUserByIdAsync(userId);
                user.PremiumCredits += credits;
                user.IsPremium = user.PremiumCredits > 0;
                user.UpdatedAt = DateTime.UtcNow;

                await _userRepository.UpdateAsync(user);
                _logger.LogInformation($"Added {credits} premium credits to user {userId}. New balance: {user.PremiumCredits}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding premium credits to user {userId}");
                throw;
            }
        }

        public async Task<PaymentRecord> CreatePaymentRecordAsync(PaymentRecord record)
        {
            try
            {
                record.Id = _paymentRecords.Count + 1;
                record.CreatedAt = DateTime.UtcNow;
                _paymentRecords.Add(record);

                _logger.LogInformation($"Created payment record for user {record.UserId}, transaction: {record.TransactionId}");
                return record;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error creating payment record for transaction {record.TransactionId}");
                throw;
            }
        }

        public async Task<PaymentRecord> GetPaymentByTransactionIdAsync(string transactionId)
        {
            try
            {
                var payment = _paymentRecords.FirstOrDefault(p => p.TransactionId == transactionId);
                if (payment == null)
                {
                    _logger.LogWarning($"Payment record not found for transaction: {transactionId}");
                }
                return payment;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting payment by transaction ID: {transactionId}");
                throw;
            }
        }
    }
}
