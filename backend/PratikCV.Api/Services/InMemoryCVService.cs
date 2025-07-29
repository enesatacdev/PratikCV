using PratikCV.Application.DTOs.CV;
using PratikCV.Application.Services.Interfaces;

namespace PratikCV.Api.Services;

/// <summary>
/// Test için In-Memory CV Service
/// </summary>
public class InMemoryCVService : ICVService
{
    private static readonly List<CVDto> _cvs = new();
    
    public Task<CVDto?> GetByUserIdAsync(string userId)
    {
        var cv = _cvs.FirstOrDefault(c => c.UserId == userId);
        return Task.FromResult(cv);
    }

    public Task<CVDto> CreateAsync(CreateCVDto createCVDto)
    {
        var cv = new CVDto
        {
            Id = Guid.NewGuid().ToString(),
            UserId = createCVDto.UserId,
            Title = createCVDto.Title,
            TemplateName = createCVDto.TemplateName,
            Status = createCVDto.Status,
            PersonalInfo = createCVDto.PersonalInfo,
            AboutMe = createCVDto.AboutMe,
            Education = createCVDto.Education,
            Experience = createCVDto.Experience,
            Skills = createCVDto.Skills,
            SocialMedia = createCVDto.SocialMedia,
            Certificates = createCVDto.Certificates,
            References = createCVDto.References,
            Extras = createCVDto.Extras,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        
        _cvs.Add(cv);
        return Task.FromResult(cv);
    }

    public Task<CVDto> UpdateAsync(string userId, UpdateCVDto updateCVDto)
    {
        var existingCV = _cvs.FirstOrDefault(c => c.UserId == userId);
        if (existingCV == null)
            throw new InvalidOperationException($"CV not found for user {userId}");

        existingCV.Title = updateCVDto.Title;
        existingCV.TemplateName = updateCVDto.TemplateName;
        existingCV.Status = updateCVDto.Status;
        existingCV.PersonalInfo = updateCVDto.PersonalInfo;
        existingCV.AboutMe = updateCVDto.AboutMe;
        existingCV.Education = updateCVDto.Education;
        existingCV.Experience = updateCVDto.Experience;
        existingCV.Skills = updateCVDto.Skills;
        existingCV.SocialMedia = updateCVDto.SocialMedia;
        existingCV.Certificates = updateCVDto.Certificates;
        existingCV.References = updateCVDto.References;
        existingCV.Extras = updateCVDto.Extras;
        existingCV.UpdatedAt = DateTime.UtcNow;

        return Task.FromResult(existingCV);
    }

    public Task<bool> DeleteAsync(string userId)
    {
        var cv = _cvs.FirstOrDefault(c => c.UserId == userId);
        if (cv == null)
            return Task.FromResult(false);

        _cvs.Remove(cv);
        return Task.FromResult(true);
    }

    public Task<List<CVDto>> GetAllActiveAsync()
    {
        return Task.FromResult(_cvs.ToList());
    }

    public Task<CVDto?> GetByIdAsync(string id)
    {
        var cv = _cvs.FirstOrDefault(c => c.Id == id);
        return Task.FromResult(cv);
    }

    // Yeni methodlar
    public Task<List<CVDto>> GetAllByUserIdAsync(string userId)
    {
        var userCVs = _cvs.Where(c => c.UserId == userId).ToList();
        return Task.FromResult(userCVs);
    }

    public Task<CVDto> UpdateByIdAsync(string id, UpdateCVDto updateCVDto)
    {
        var existingCV = _cvs.FirstOrDefault(c => c.Id == id);
        if (existingCV == null)
            throw new InvalidOperationException($"CV not found with ID {id}");

        existingCV.Title = updateCVDto.Title;
        existingCV.TemplateName = updateCVDto.TemplateName;
        existingCV.Status = updateCVDto.Status;
        existingCV.PersonalInfo = updateCVDto.PersonalInfo;
        existingCV.AboutMe = updateCVDto.AboutMe;
        existingCV.Education = updateCVDto.Education;
        existingCV.Experience = updateCVDto.Experience;
        existingCV.Skills = updateCVDto.Skills;
        existingCV.SocialMedia = updateCVDto.SocialMedia;
        existingCV.Certificates = updateCVDto.Certificates;
        existingCV.References = updateCVDto.References;
        existingCV.Extras = updateCVDto.Extras;
        existingCV.UpdatedAt = DateTime.UtcNow;

        return Task.FromResult(existingCV);
    }

    public Task<bool> DeleteByIdAsync(string id)
    {
        var cv = _cvs.FirstOrDefault(c => c.Id == id);
        if (cv == null)
            return Task.FromResult(false);

        _cvs.Remove(cv);
        return Task.FromResult(true);
    }
}
