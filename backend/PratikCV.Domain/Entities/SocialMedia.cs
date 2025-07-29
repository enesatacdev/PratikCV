using MongoDB.Bson.Serialization.Attributes;

namespace PratikCV.Domain.Entities;

public class SocialMedia
{
    [BsonElement("platform")]
    public string Platform { get; set; } = string.Empty;

    [BsonElement("url")]
    public string Url { get; set; } = string.Empty;
}
