using PratikCV.Domain.Entities;

namespace PratikCV.Application.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(string email, string password, string firstName, string lastName);
    Task<AuthResult> LoginAsync(string email, string password);
    Task<User?> GetUserByIdAsync(string userId);
    Task<User?> UpdateProfileAsync(string userId, string firstName, string lastName, string email, List<string>? phones = null, string? profilePhoto = null, string? address = null, List<string>? emails = null, DateTime? birthDate = null);
    Task ChangePasswordAsync(string userId, string currentPassword, string newPassword);
    Task<User?> UpgradeToPremiumAsync(string userId);
    Task<User?> AddPremiumCreditsAsync(string userId, int credits);
    Task<User?> DeductPremiumCreditAsync(string userId);
}

public class AuthResult
{
    public bool Success { get; set; }
    public string? Token { get; set; }
    public User? User { get; set; }
    public string? ErrorMessage { get; set; }
}
