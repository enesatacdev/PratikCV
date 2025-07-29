using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PratikCV.Domain.Entities;

public class CVDocument
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("userId")]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("templateName")]
    public string TemplateName { get; set; } = "modern";

    [BsonElement("status")]
    public string Status { get; set; } = "draft";

    [BsonElement("personalInfo")]
    public PersonalInfo PersonalInfo { get; set; } = new();

    [BsonElement("aboutMe")]
    public string? AboutMe { get; set; }

    [BsonElement("education")]
    public List<Education> Education { get; set; } = new();

    [BsonElement("experience")]
    public List<Experience> Experience { get; set; } = new();

    [BsonElement("skills")]
    public Skills Skills { get; set; } = new();

    [BsonElement("socialMedia")]
    public List<SocialMedia> SocialMedia { get; set; } = new();

    [BsonElement("certificates")]
    public List<Certificate> Certificates { get; set; } = new();

    [BsonElement("references")]
    public List<Reference> References { get; set; } = new();

    [BsonElement("extras")]
    public Extras Extras { get; set; } = new();

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;
}
