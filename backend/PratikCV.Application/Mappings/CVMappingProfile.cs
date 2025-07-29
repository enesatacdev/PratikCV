using AutoMapper;
using PratikCV.Application.DTOs.CV;
using PratikCV.Domain.Entities;

namespace PratikCV.Application.Mappings;

public class CVMappingProfile : Profile
{
    public CVMappingProfile()
    {
        // CVDocument to CVDto
        CreateMap<CVDocument, CVDto>();
        CreateMap<CVDto, CVDocument>();

        // CreateCVDto to CVDocument
        CreateMap<CreateCVDto, CVDocument>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

        // UpdateCVDto to CVDocument
        CreateMap<UpdateCVDto, CVDocument>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.IsActive, opt => opt.Ignore());

        // Personal Info mappings
        CreateMap<PersonalInfo, PersonalInfoDto>();
        CreateMap<PersonalInfoDto, PersonalInfo>();

        // Education mappings
        CreateMap<Education, EducationDto>();
        CreateMap<EducationDto, Education>();

        // Experience mappings
        CreateMap<Experience, ExperienceDto>();
        CreateMap<ExperienceDto, Experience>();

        // Skills mappings
        CreateMap<Skills, SkillsDto>();
        CreateMap<SkillsDto, Skills>();

        // Language mappings
        CreateMap<Language, LanguageDto>()
            .ForMember(dest => dest.Language, opt => opt.MapFrom(src => src.LanguageName));
        CreateMap<LanguageDto, Language>()
            .ForMember(dest => dest.LanguageName, opt => opt.MapFrom(src => src.Language));

        // Social Media mappings
        CreateMap<SocialMedia, SocialMediaDto>();
        CreateMap<SocialMediaDto, SocialMedia>();

        // Certificate mappings
        CreateMap<Certificate, CertificateDto>();
        CreateMap<CertificateDto, Certificate>();

        // Reference mappings
        CreateMap<Reference, ReferenceDto>();
        CreateMap<ReferenceDto, Reference>();

        // Extras mappings
        CreateMap<Extras, ExtrasDto>();
        CreateMap<ExtrasDto, Extras>();

        // Project mappings
        CreateMap<Project, ProjectDto>();
        CreateMap<ProjectDto, Project>();

        // Volunteer Work mappings
        CreateMap<VolunteerWork, VolunteerWorkDto>();
        CreateMap<VolunteerWorkDto, VolunteerWork>();

        // Award mappings
        CreateMap<Award, AwardDto>();
        CreateMap<AwardDto, Award>();
    }
}
