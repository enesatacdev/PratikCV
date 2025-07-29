using MongoDB.Bson.Serialization.Attributes;

namespace PratikCV.Domain.Entities;

public class Extras
{
    [BsonElement("hobbies")]
    public List<string> Hobbies { get; set; } = new();

    [BsonElement("projects")]
    public List<Project> Projects { get; set; } = new();

    [BsonElement("volunteerWork")]
    public List<VolunteerWork> VolunteerWork { get; set; } = new();

    [BsonElement("awards")]
    public List<Award> Awards { get; set; } = new();
}

public class Project
{
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("url")]
    public string? Url { get; set; }

    [BsonElement("technologies")]
    public string? Technologies { get; set; }
}

public class VolunteerWork
{
    [BsonElement("organization")]
    public string Organization { get; set; } = string.Empty;

    [BsonElement("position")]
    public string Position { get; set; } = string.Empty;

    [BsonElement("startDate")]
    public string StartDate { get; set; } = string.Empty;

    [BsonElement("endDate")]
    public string? EndDate { get; set; }

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;
}

public class Award
{
    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("organization")]
    public string Organization { get; set; } = string.Empty;

    [BsonElement("date")]
    public string Date { get; set; } = string.Empty;

    [BsonElement("description")]
    public string? Description { get; set; }
}
