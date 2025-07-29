using PratikCV.Application.Services.Interfaces;
using PratikCV.Domain.Entities;
using PratikCV.Domain.Repositories;

namespace PratikCV.Application.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public AuthService(IUserRepository userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<AuthResult> RegisterAsync(string email, string password, string firstName, string lastName)
    {
        // Email kontrolü
        if (await _userRepository.ExistsAsync(email))
        {
            return new AuthResult { Success = false, ErrorMessage = "Bu email adresi zaten kayıtlı." };
        }

        // Şifre hash'le
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

        // Yeni kullanıcı oluştur
        var user = new User
        {
            Email = email,
            Password = hashedPassword,
            FirstName = firstName,
            LastName = lastName,
            IsEmailVerified = true // Şimdilik email doğrulama yok
        };

        try
        {
            var createdUser = await _userRepository.CreateAsync(user);
            var token = _jwtService.GenerateToken(createdUser);

            return new AuthResult
            {
                Success = true,
                Token = token,
                User = createdUser
            };
        }
        catch (Exception ex)
        {
            return new AuthResult { Success = false, ErrorMessage = "Kullanıcı oluşturulurken hata oluştu." };
        }
    }

    public async Task<AuthResult> LoginAsync(string email, string password)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null)
        {
            return new AuthResult { Success = false, ErrorMessage = "Email veya şifre hatalı." };
        }

        // Şifre kontrolü
        if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
        {
            return new AuthResult { Success = false, ErrorMessage = "Email veya şifre hatalı." };
        }

        var token = _jwtService.GenerateToken(user);

        return new AuthResult
        {
            Success = true,
            Token = token,
            User = user
        };
    }

    public async Task<User?> GetUserByIdAsync(string userId)
    {
        return await _userRepository.GetByIdAsync(userId);
    }

public async Task<User?> UpdateProfileAsync(string userId, string firstName, string lastName, string email, List<string>? phones = null, string? profilePhoto = null, string? address = null, List<string>? emails = null, DateTime? birthDate = null)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return null;

        user.FirstName = firstName;
        user.LastName = lastName;
        user.Email = email;
        if (phones != null)
        {
            user.Phones = phones;
        }
        if (emails != null)
        {
            user.Emails = emails;
        }
        if (!string.IsNullOrEmpty(profilePhoto))
        {
            user.ProfilePhoto = profilePhoto;
        }
        if (!string.IsNullOrEmpty(address))
        {
            user.Address = address;
        }
        if (birthDate.HasValue)
        {
            user.BirthDate = birthDate.Value;
        }

        return await _userRepository.UpdateAsync(user);
    }

    public async Task ChangePasswordAsync(string userId, string currentPassword, string newPassword)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new ArgumentException("Kullanıcı bulunamadı.");
        }

        // Mevcut şifre kontrolü
        if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.Password))
        {
            throw new ArgumentException("Mevcut şifre hatalı.");
        }

        // Yeni şifreyi hashle ve güncelle
        user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _userRepository.UpdateAsync(user);
    }

    public async Task<User?> UpgradeToPremiumAsync(string userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new ArgumentException("Kullanıcı bulunamadı.");
        }

        user.IsPremium = true;
        user.UpdatedAt = DateTime.UtcNow;
        
        return await _userRepository.UpdateAsync(user);
    }

    public async Task<User?> AddPremiumCreditsAsync(string userId, int credits)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new ArgumentException("Kullanıcı bulunamadı.");
        }

        if (credits <= 0)
        {
            throw new ArgumentException("Kredi miktarı 0'dan büyük olmalıdır.");
        }

        user.PremiumCredits += credits;
        user.UpdatedAt = DateTime.UtcNow;
        
        return await _userRepository.UpdateAsync(user);
    }

    public async Task<User?> DeductPremiumCreditAsync(string userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new ArgumentException("Kullanıcı bulunamadı.");
        }

        if (user.PremiumCredits < 1)
        {
            throw new InvalidOperationException("Yeterli premium krediniz bulunmamaktadır.");
        }

        user.PremiumCredits -= 1;
        user.UpdatedAt = DateTime.UtcNow;
        
        return await _userRepository.UpdateAsync(user);
    }
}
