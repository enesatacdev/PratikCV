using Microsoft.AspNetCore.Mvc;
using PratikCV.Application.DTOs.CV;
using PratikCV.Application.Services.Interfaces;
using System.Net;

namespace PratikCV.Api.Controllers;

/// <summary>
/// CV yönetimi için API controller'ı
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CVController : ControllerBase
{
    private readonly ICVService _cvService;
    private readonly ILogger<CVController> _logger;

    public CVController(ICVService cvService, ILogger<CVController> logger)
    {
        _cvService = cvService;
        _logger = logger;
    }

    /// <summary>
    /// Kullanıcının tüm CV'lerini getirir
    /// </summary>
    /// <param name="userId">Kullanıcı ID'si</param>
    /// <returns>Kullanıcının CV listesi</returns>
    /// <response code="200">CV listesi başarıyla döndürüldü</response>
    /// <response code="400">Geçersiz kullanıcı ID'si</response>
    [HttpGet("user/{userId}/list")]
    [ProducesResponseType(typeof(List<CVSummaryDto>), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<ActionResult<List<CVSummaryDto>>> GetUserCVList(string userId)
    {
        try
        {
            _logger.LogInformation("Getting CV list for user: {UserId}", userId);
            
            // Kullanıcının tüm CV'lerini getir
            var cvs = await _cvService.GetAllByUserIdAsync(userId);
            var cvList = new List<CVSummaryDto>();
            
            foreach (var cv in cvs)
            {
                // Template display name'lerini map et
                string templateDisplayName = cv.TemplateName switch
                {
                    "modern" => "Modern Template",
                    "premium" => "Premium Template", 
                    "classic" => "Classic Template",
                    "executive" => "Executive Black Template",
                    _ => "Modern Template"
                };

                cvList.Add(new CVSummaryDto
                {
                    Id = cv.Id,
                    Title = cv.Title ?? $"{cv.PersonalInfo.FullName} CV",
                    TemplateName = templateDisplayName,
                    TemplateId = cv.TemplateName ?? "modern", // Orijinal template ID'sini de ekle
                    Status = cv.Status ?? "draft",
                    CreatedAt = cv.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss"),
                    UpdatedAt = cv.UpdatedAt.ToString("yyyy-MM-ddTHH:mm:ss"),
                    PreviewUrl = $"/api/cv/{cv.Id}/preview",
                    DownloadUrl = $"/api/cv/{cv.Id}/download"
                });
            }

            _logger.LogInformation("Found {Count} CVs for user: {UserId}", cvList.Count, userId);
            return Ok(cvList);
        }
        catch (ArgumentException ex)
        {
            _logger.LogError(ex, "Invalid argument for user: {UserId}", userId);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting CV list for user: {UserId}", userId);
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    /// <summary>
    /// Kullanıcının CV'sini getirir
    /// </summary>
    /// <param name="userId">Kullanıcı ID'si</param>
    /// <returns>CV verisi</returns>
    /// <response code="200">CV başarıyla döndürüldü</response>
    /// <response code="404">CV bulunamadı</response>
    /// <response code="400">Geçersiz kullanıcı ID'si</response>
    [HttpGet("user/{userId}")]
    [ProducesResponseType(typeof(CVDto), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<ActionResult<CVDto>> GetByUserId(string userId)
    {
        try
        {
            _logger.LogInformation("Getting CV for user: {UserId}", userId);
            
            var cv = await _cvService.GetByUserIdAsync(userId);
            if (cv == null)
            {
                _logger.LogWarning("CV not found for user: {UserId}", userId);
                return NotFound($"CV not found for user {userId}");
            }

            _logger.LogInformation("CV found for user: {UserId}", userId);
            return Ok(cv);
        }
        catch (ArgumentException ex)
        {
            _logger.LogError(ex, "Invalid argument for user: {UserId}", userId);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting CV for user: {UserId}", userId);
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    /// <summary>
    /// ID'ye göre CV getirir
    /// </summary>
    /// <param name="id">CV ID'si</param>
    /// <returns>CV verisi</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<CVDto>> GetById(string id)
    {
        try
        {
            var cv = await _cvService.GetByIdAsync(id);
            if (cv == null)
                return NotFound($"CV not found with id {id}");

            return Ok(cv);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    /// <summary>
    /// Yeni CV oluşturur
    /// </summary>
    /// <param name="createCVDto">CV oluşturma verisi</param>
    /// <returns>Oluşturulan CV</returns>
    /// <response code="201">CV başarıyla oluşturuldu</response>
    /// <response code="400">Geçersiz veri</response>
    /// <response code="409">Bu kullanıcı için CV zaten mevcut</response>
    [HttpPost]
    [ProducesResponseType(typeof(CVDto), (int)HttpStatusCode.Created)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType((int)HttpStatusCode.Conflict)]
    public async Task<ActionResult<CVDto>> Create([FromBody] CreateCVDto createCVDto)
    {
        try
        {
            var cv = await _cvService.CreateAsync(createCVDto);
            return CreatedAtAction(nameof(GetById), new { id = cv.Id }, cv);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    /// <summary>
    /// CV'yi günceller
    /// </summary>
    /// <param name="userId">Kullanıcı ID'si</param>
    /// <param name="updateCVDto">Güncelleme verisi</param>
    /// <returns>Güncellenmiş CV</returns>
    /// <response code="200">CV başarıyla güncellendi</response>
    /// <response code="400">Geçersiz veri</response>
    /// <response code="404">CV bulunamadı</response>
    [HttpPut("user/{userId}")]
    [ProducesResponseType(typeof(CVDto), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType((int)HttpStatusCode.NotFound)]
    public async Task<ActionResult<CVDto>> Update(string userId, [FromBody] UpdateCVDto updateCVDto)
    {
        try
        {
            var cv = await _cvService.UpdateAsync(userId, updateCVDto);
            return Ok(cv);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    /// <summary>
    /// ID'ye göre CV'yi günceller
    /// </summary>
    /// <param name="id">CV ID'si</param>
    /// <param name="updateCVDto">Güncelleme verisi</param>
    /// <returns>Güncellenmiş CV</returns>
    /// <response code="200">CV başarıyla güncellendi</response>
    /// <response code="400">Geçersiz veri</response>
    /// <response code="404">CV bulunamadı</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(CVDto), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType((int)HttpStatusCode.NotFound)]
    public async Task<ActionResult<CVDto>> UpdateById(string id, [FromBody] UpdateCVDto updateCVDto)
    {
        try
        {
            var cv = await _cvService.UpdateByIdAsync(id, updateCVDto);
            return Ok(cv);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    /// <summary>
    /// CV'yi siler (soft delete) - User ID ile
    /// </summary>
    /// <param name="userId">Kullanıcı ID'si</param>
    /// <returns>Silme durumu</returns>
    [HttpDelete("user/{userId}")]
    public async Task<ActionResult> Delete(string userId)
    {
        try
        {
            var result = await _cvService.DeleteAsync(userId);
            if (!result)
                return NotFound($"CV not found for user {userId}");

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    /// <summary>
    /// CV'yi siler (soft delete) - CV ID ile
    /// </summary>
    /// <param name="id">CV ID'si</param>
    /// <returns>Silme durumu</returns>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteById(string id)
    {
        try
        {
            var result = await _cvService.DeleteByIdAsync(id);
            if (!result)
                return NotFound($"CV not found with ID {id}");

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    /// <summary>
    /// Tüm aktif CV'leri getirir
    /// </summary>
    /// <returns>CV listesi</returns>
    /// <response code="200">CV listesi başarıyla döndürüldü</response>
    [HttpGet]
    [ProducesResponseType(typeof(List<CVDto>), (int)HttpStatusCode.OK)]
    public async Task<ActionResult<List<CVDto>>> GetAllActive()
    {
        try
        {
            var cvs = await _cvService.GetAllActiveAsync();
            return Ok(cvs);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    /// <summary>
    /// CV'yi kopyalar (şu an için desteklenmiyor)
    /// </summary>
    /// <param name="id">CV ID'si</param>
    /// <returns>Kopyalanan CV</returns>
    [HttpPost("{id}/duplicate")]
    [ProducesResponseType(typeof(CVSummaryDto), (int)HttpStatusCode.Created)]
    [ProducesResponseType((int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<ActionResult<CVSummaryDto>> DuplicateCV(string id)
    {
        try
        {
            // Bu özellik henüz desteklenmiyor çünkü kullanıcı başına sadece 1 CV var
            return BadRequest("CV duplication is not supported in current version. Each user can have only one CV.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error duplicating CV with id: {Id}", id);
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    /// <summary>
    /// Kullanıcı için CV varlığını kontrol eder
    /// </summary>
    /// <param name="userId">Kullanıcı ID'si</param>
    /// <returns>CV var mı?</returns>
    [HttpHead("user/{userId}")]
    public async Task<ActionResult> CheckExists(string userId)
    {
        try
        {
            var cv = await _cvService.GetByUserIdAsync(userId);
            return cv != null ? Ok() : NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    /// <summary>
    /// Test verisi yükler (Development only)
    /// </summary>
    /// <returns>Yüklenen test verisi</returns>
    [HttpPost("load-test-data")]
    [ProducesResponseType(typeof(CVDto), (int)HttpStatusCode.Created)]
    public async Task<ActionResult<CVDto>> LoadTestData()
    {
        try
        {
            var testCVDto = new CreateCVDto
            {
                UserId = "test-user-123",
                TemplateName = "premium", // Premium template kullan
                PersonalInfo = new PersonalInfoDto
                {
                    FullName = "Test User",
                    Birthday = "1990-01-01",
                    Phones = new List<string> { "555-1234", "555-5678" },
                    Emails = new List<string> { "test@example.com" },
                    Address = "Test Address",
                    Nationality = "Turkish",
                    DrivingLicense = "B",
                    ProfilePhoto = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                    Summary = "Test summary"
                },
                Education = new List<EducationDto>
                {
                    new EducationDto
                    {
                        School = "Test University",
                        Department = "Computer Science",
                        StartDate = "2020-09",
                        EndDate = "2024-06",
                        Degree = "Bachelor",
                        Gpa = "3.5"
                    }
                },
                Experience = new List<ExperienceDto>
                {
                    new ExperienceDto
                    {
                        Company = "Test Company",
                        Position = "Software Developer",
                        StartDate = "2024-07",
                        EndDate = "",
                        Description = "Test description",
                        Achievements = "Test achievements"
                    }
                },
                Skills = new SkillsDto
                {
                    Technical = new List<string> { "C#", "MongoDB", "React" },
                    Personal = new List<string> { "Team work", "Communication" },
                    Languages = new List<LanguageDto>
                    {
                        new LanguageDto { Language = "Turkish", Level = "Ana Dil" },
                        new LanguageDto { Language = "English", Level = "B2" }
                    }
                },
                SocialMedia = new List<SocialMediaDto>
                {
                    new SocialMediaDto { Platform = "LinkedIn", Url = "https://linkedin.com/in/testuser" }
                },
                Certificates = new List<CertificateDto>
                {
                    new CertificateDto
                    {
                        Name = "Test Certificate",
                        Issuer = "Test Organization",
                        Date = "2024-01",
                        Url = "https://example.com/cert"
                    }
                },
                References = new List<ReferenceDto>
                {
                    new ReferenceDto
                    {
                        Name = "John Doe",
                        Position = "Manager",
                        Company = "Test Company",
                        Phone = "555-9999",
                        Email = "john@testcompany.com",
                        Relationship = "Önceki Yönetici"
                    }
                },
                Extras = new ExtrasDto
                {
                    Hobbies = new List<string> { "Reading", "Swimming" },
                    Projects = new List<ProjectDto>
                    {
                        new ProjectDto
                        {
                            Name = "Test Project",
                            Description = "A test project",
                            Url = "https://github.com/test/project",
                            Technologies = "React, Node.js"
                        }
                    },
                    VolunteerWork = new List<VolunteerWorkDto>
                    {
                        new VolunteerWorkDto
                        {
                            Organization = "Test NGO",
                            Position = "Volunteer",
                            StartDate = "2023-01",
                            EndDate = "2023-12",
                            Description = "Volunteer work description"
                        }
                    },
                    Awards = new List<AwardDto>
                    {
                        new AwardDto
                        {
                            Title = "Best Student",
                            Organization = "Test University",
                            Date = "2024-06",
                            Description = "Award description"
                        }
                    }
                }
            };

            _logger.LogInformation("Loading test CV data for user: {UserId}", testCVDto.UserId);
            var cv = await _cvService.CreateAsync(testCVDto);
            _logger.LogInformation("Test CV data loaded successfully for user: {UserId}", testCVDto.UserId);
            
            return CreatedAtAction(nameof(GetById), new { id = cv.Id }, cv);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error loading test CV data");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
