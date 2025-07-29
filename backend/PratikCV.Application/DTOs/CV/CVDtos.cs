namespace PratikCV.Application.DTOs.CV;

public class CVDto
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string TemplateName { get; set; } = "modern";
    public string Status { get; set; } = "draft";
    public PersonalInfoDto PersonalInfo { get; set; } = new();
    public string? AboutMe { get; set; }
    public List<EducationDto> Education { get; set; } = new();
    public List<ExperienceDto> Experience { get; set; } = new();
    public SkillsDto Skills { get; set; } = new();
    public List<SocialMediaDto> SocialMedia { get; set; } = new();
    public List<CertificateDto> Certificates { get; set; } = new();
    public List<ReferenceDto> References { get; set; } = new();
    public ExtrasDto Extras { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CVSummaryDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string TemplateName { get; set; } = string.Empty;
    public string TemplateId { get; set; } = string.Empty; // Orijinal template ID'si (premium, modern, classic)
    public string Status { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
    public string UpdatedAt { get; set; } = string.Empty;
    public string? PreviewUrl { get; set; }
    public string? DownloadUrl { get; set; }
}

public class CreateCVDto
{
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string TemplateName { get; set; } = "modern";
    public string Status { get; set; } = "draft";
    public PersonalInfoDto PersonalInfo { get; set; } = new();
    public string? AboutMe { get; set; }
    public List<EducationDto> Education { get; set; } = new();
    public List<ExperienceDto> Experience { get; set; } = new();
    public SkillsDto Skills { get; set; } = new();
    public List<SocialMediaDto> SocialMedia { get; set; } = new();
    public List<CertificateDto> Certificates { get; set; } = new();
    public List<ReferenceDto> References { get; set; } = new();
    public ExtrasDto Extras { get; set; } = new();
}

public class UpdateCVDto
{
    public string Title { get; set; } = string.Empty;
    public string TemplateName { get; set; } = "modern";
    public string Status { get; set; } = "draft";
    public PersonalInfoDto PersonalInfo { get; set; } = new();
    public string? AboutMe { get; set; }
    public List<EducationDto> Education { get; set; } = new();
    public List<ExperienceDto> Experience { get; set; } = new();
    public SkillsDto Skills { get; set; } = new();
    public List<SocialMediaDto> SocialMedia { get; set; } = new();
    public List<CertificateDto> Certificates { get; set; } = new();
    public List<ReferenceDto> References { get; set; } = new();
    public ExtrasDto Extras { get; set; } = new();
}

public class PersonalInfoDto
{
    public string FullName { get; set; } = string.Empty;
    public string Birthday { get; set; } = string.Empty;
    public List<string> Phones { get; set; } = new();
    public List<string> Emails { get; set; } = new();
    public string Address { get; set; } = string.Empty;
    public string Nationality { get; set; } = string.Empty;
    public string DrivingLicense { get; set; } = string.Empty;
    public string ProfilePhoto { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
}

public class EducationDto
{
    public string School { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public string Gpa { get; set; } = string.Empty;
}

public class ExperienceDto
{
    public string Company { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Achievements { get; set; } = string.Empty;
}

public class SkillsDto
{
    public List<string> Technical { get; set; } = new();
    public List<string> Personal { get; set; } = new();
    public List<LanguageDto> Languages { get; set; } = new();
}

public class LanguageDto
{
    public string Language { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
}

public class SocialMediaDto
{
    public string Platform { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public class CertificateDto
{
    public string Name { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string? Url { get; set; }
}

public class ReferenceDto
{
    public string Name { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
}

public class ExtrasDto
{
    public List<string> Hobbies { get; set; } = new();
    public List<ProjectDto> Projects { get; set; } = new();
    public List<VolunteerWorkDto> VolunteerWork { get; set; } = new();
    public List<AwardDto> Awards { get; set; } = new();
}

public class ProjectDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Url { get; set; }
    public string? Technologies { get; set; }
}

public class VolunteerWorkDto
{
    public string Organization { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string? EndDate { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class AwardDto
{
    public string Title { get; set; } = string.Empty;
    public string Organization { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string? Description { get; set; }
}
