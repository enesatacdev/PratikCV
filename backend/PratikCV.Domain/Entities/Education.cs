using MongoDB.Bson.Serialization.Attributes;

namespace PratikCV.Domain.Entities;

public class Education
{
    [BsonElement("school")]
    public string School { get; set; } = string.Empty;

    [BsonElement("department")]
    public string Department { get; set; } = string.Empty;

    [BsonElement("startDate")]
    public string StartDate { get; set; } = string.Empty;

    [BsonElement("endDate")]
    public string EndDate { get; set; } = string.Empty;

    [BsonElement("degree")]
    public string Degree { get; set; } = string.Empty;

    [BsonElement("gpa")]
    public string Gpa { get; set; } = string.Empty;
}
