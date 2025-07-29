using MongoDB.Bson.Serialization.Attributes;

namespace PratikCV.Domain.Entities;

public class Experience
{
    [BsonElement("company")]
    public string Company { get; set; } = string.Empty;

    [BsonElement("position")]
    public string Position { get; set; } = string.Empty;

    [BsonElement("startDate")]
    public string StartDate { get; set; } = string.Empty;

    [BsonElement("endDate")]
    public string EndDate { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("achievements")]
    public string Achievements { get; set; } = string.Empty;
}
