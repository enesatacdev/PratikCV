using PratikCV.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace PratikCV.Application.Services.Interfaces
{
    public interface IUserService
    {
        Task<User> GetUserByIdAsync(string userId);
        Task AddPremiumCreditsAsync(string userId, int credits);
        Task<PaymentRecord> CreatePaymentRecordAsync(PaymentRecord record);
        Task<PaymentRecord> GetPaymentByTransactionIdAsync(string transactionId);
    }

    public class PaymentRecord
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string PlanId { get; set; }
        public int Credits { get; set; }
        public decimal Amount { get; set; }
        public string TransactionId { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Status { get; set; }
        public string PaymentMethod { get; set; }
        public string BuyerEmail { get; set; }
        public string BuyerName { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
