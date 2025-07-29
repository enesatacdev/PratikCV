using MongoDB.Bson.Serialization.Attributes;

namespace PratikCV.Domain.Entities;

public class Certificate
{
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("issuer")]
    public string Issuer { get; set; } = string.Empty;

    [BsonElement("date")]
    public string Date { get; set; } = string.Empty;

    [BsonElement("url")]
    public string? Url { get; set; }
}
