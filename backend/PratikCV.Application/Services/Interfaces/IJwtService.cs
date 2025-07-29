using PratikCV.Domain.Entities;

namespace PratikCV.Application.Services.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
    string? ValidateToken(string token);
}
