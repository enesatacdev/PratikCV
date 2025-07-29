using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PratikCV.Domain.Entities;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("email")]
    public string Email { get; set; } = string.Empty; // Primary email for authentication

    [BsonElement("password")]
    public string Password { get; set; } = string.Empty; // Hashed password

    [BsonElement("firstName")]
    public string FirstName { get; set; } = string.Empty;

    [BsonElement("lastName")]
    public string LastName { get; set; } = string.Empty;

    [BsonElement("birthDate")]
    public DateTime? BirthDate { get; set; }

    [BsonElement("phones")]
    public List<string> Phones { get; set; } = new List<string>();

    [BsonElement("emails")]
    public List<string> Emails { get; set; } = new List<string>();

    [BsonElement("address")]
    public string Address { get; set; } = string.Empty;

    [BsonElement("profilePhoto")]
    public string ProfilePhoto { get; set; } = string.Empty;

    [BsonElement("isPremium")]
    public bool IsPremium { get; set; } = false;

    [BsonElement("premiumCredits")]
    public int PremiumCredits { get; set; } = 0;

    [BsonElement("isEmailVerified")]
    public bool IsEmailVerified { get; set; } = false;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("isDeleted")]
    public bool IsDeleted { get; set; } = false;

    // Helper properties
    [BsonIgnore]
    public string FullName => $"{FirstName} {LastName}".Trim();

    
}
