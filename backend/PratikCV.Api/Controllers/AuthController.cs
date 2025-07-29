using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PratikCV.Application.Services.Interfaces;
using System.Security.Claims;

namespace PratikCV.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.RegisterAsync(
            request.Email, 
            request.Password, 
            request.FirstName, 
            request.LastName);

        if (!result.Success)
            return BadRequest(new { message = result.ErrorMessage });

        return Ok(new
        {
            token = result.Token,
            user = new
            {
                id = result.User!.Id,
                email = result.User.Email,
                firstName = result.User.FirstName,
                lastName = result.User.LastName,
                fullName = result.User.FullName,
                profilePhoto = result.User.ProfilePhoto,
                isPremium = result.User.IsPremium,
                premiumCredits = result.User.PremiumCredits
            }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.LoginAsync(request.Email, request.Password);

        if (!result.Success)
            return BadRequest(new { message = result.ErrorMessage });

        return Ok(new
        {
            token = result.Token,
            user = new
            {
                id = result.User!.Id,
                email = result.User.Email,
                firstName = result.User.FirstName,
                lastName = result.User.LastName,
                fullName = result.User.FullName,
                profilePhoto = result.User.ProfilePhoto,
                isPremium = result.User.IsPremium,
                premiumCredits = result.User.PremiumCredits
            }
        });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var user = await _authService.GetUserByIdAsync(userId);
        if (user == null)
            return NotFound();

        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            firstName = user.FirstName,
            lastName = user.LastName,
            fullName = user.FullName,
            profilePhoto = user.ProfilePhoto,
            phones = user.Phones,
            emails = user.Emails,
            address = user.Address,
            birthDate = user.BirthDate,
            isPremium = user.IsPremium,
            premiumCredits = user.PremiumCredits
        });
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var user = await _authService.UpdateProfileAsync(
            userId, 
            request.FirstName, 
            request.LastName, 
            request.Email,
            null, // phones
            request.ProfilePhoto,
            null, // address
            null, // emails
            null); // birthDate

        if (user == null)
            return NotFound();

        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            firstName = user.FirstName,
            lastName = user.LastName,
            fullName = user.FullName,
            profilePhoto = user.ProfilePhoto,
            isPremium = user.IsPremium
        });
    }

    [HttpPut("profile-from-cv")]
    [Authorize]
    public async Task<IActionResult> UpdateProfileFromCV([FromBody] UpdateProfileFromCVRequest request)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        // CV Personal Info'dan User bilgilerini güncelle
        var fullNameParts = request.FullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var firstName = fullNameParts.Length > 0 ? fullNameParts[0] : "";
        var lastName = fullNameParts.Length > 1 ? string.Join(" ", fullNameParts.Skip(1)) : "";
        
        // Email listesinden ilkini al
        var primaryEmail = request.Emails?.FirstOrDefault(e => !string.IsNullOrWhiteSpace(e))?.Trim();
        if (string.IsNullOrEmpty(primaryEmail))
        {
            primaryEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value ?? "";
        }

        var user = await _authService.UpdateProfileAsync(
            userId,
            firstName,
            lastName,
            primaryEmail,
            request.Phones,
            request.ProfilePhoto,
            request.Address,
            request.Emails,
            request.BirthDate);

        if (user == null)
            return NotFound();

        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            firstName = user.FirstName,
            lastName = user.LastName,
            fullName = user.FullName,
            profilePhoto = user.ProfilePhoto,
            phones = user.Phones,
            emails = user.Emails,
            address = user.Address,
            birthDate = user.BirthDate,
            isPremium = user.IsPremium,
            premiumCredits = user.PremiumCredits
        });
    }

    [HttpPut("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found");

            await _authService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword);
            return Ok(new { message = "Password updated successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("upgrade-premium")]
    [Authorize]
    public async Task<IActionResult> UpgradeToPremium()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found");

            var user = await _authService.UpgradeToPremiumAsync(userId);
            if (user == null)
                return NotFound("User not found");

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                firstName = user.FirstName,
                lastName = user.LastName,
                fullName = user.FullName,
                profilePhoto = user.ProfilePhoto,
                isPremium = user.IsPremium,
                premiumCredits = user.PremiumCredits,
                message = "Successfully upgraded to Premium!"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("add-premium-credits")]
    [Authorize]
    public async Task<IActionResult> AddPremiumCredits([FromBody] AddPremiumCreditsRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found");

            var user = await _authService.AddPremiumCreditsAsync(userId, request.Credits);
            if (user == null)
                return NotFound("User not found");

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                firstName = user.FirstName,
                lastName = user.LastName,
                fullName = user.FullName,
                profilePhoto = user.ProfilePhoto,
                isPremium = user.IsPremium,
                premiumCredits = user.PremiumCredits,
                message = $"Successfully added {request.Credits} premium credits!"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("deduct-premium-credit")]
    [Authorize]
    public async Task<IActionResult> DeductPremiumCredit()
    {
        try
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var updatedUser = await _authService.DeductPremiumCreditAsync(userId);
            if (updatedUser == null)
                return BadRequest(new { message = "Failed to deduct credit" });

            return Ok(new 
            { 
                success = true,
                message = "Premium credit deducted successfully",
                remainingCredits = updatedUser.PremiumCredits,
                user = new
                {
                    id = updatedUser.Id,
                    email = updatedUser.Email,
                    firstName = updatedUser.FirstName,
                    lastName = updatedUser.LastName,
                    fullName = updatedUser.FullName,
                    profilePhoto = updatedUser.ProfilePhoto,
                    isPremium = updatedUser.IsPremium,
                    premiumCredits = updatedUser.PremiumCredits
                }
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}

public class RegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class UpdateProfileRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? ProfilePhoto { get; set; }
}

public class UpdateProfileFromCVRequest
{
    public string FullName { get; set; } = string.Empty;
    public List<string>? Emails { get; set; }
    public List<string>? Phones { get; set; }
    public string? ProfilePhoto { get; set; }
    public string? Address { get; set; }
    public DateTime? BirthDate { get; set; }
}

public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class AddPremiumCreditsRequest
{
    public int Credits { get; set; }
}
