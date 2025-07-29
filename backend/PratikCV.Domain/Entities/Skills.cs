using MongoDB.Bson.Serialization.Attributes;

namespace PratikCV.Domain.Entities;

public class Skills
{
    [BsonElement("technical")]
    public List<string> Technical { get; set; } = new();

    [BsonElement("personal")]
    public List<string> Personal { get; set; } = new();

    [BsonElement("languages")]
    public List<Language> Languages { get; set; } = new();
}

public class Language
{
    [BsonElement("language")]
    public string LanguageName { get; set; } = string.Empty;

    [BsonElement("level")]
    public string Level { get; set; } = string.Empty;
}
