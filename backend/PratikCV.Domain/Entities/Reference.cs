using MongoDB.Bson.Serialization.Attributes;

namespace PratikCV.Domain.Entities;

public class Reference
{
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("position")]
    public string Position { get; set; } = string.Empty;

    [BsonElement("company")]
    public string Company { get; set; } = string.Empty;

    [BsonElement("phone")]
    public string Phone { get; set; } = string.Empty;

    [BsonElement("email")]
    public string Email { get; set; } = string.Empty;

    [BsonElement("relationship")]
    public string Relationship { get; set; } = string.Empty;
}
