using MongoDB.Bson.Serialization.Attributes;

namespace PratikCV.Domain.Entities;

public class PersonalInfo
{
    [BsonElement("fullName")]
    public string FullName { get; set; } = string.Empty;

    [BsonElement("birthday")]
    public string Birthday { get; set; } = string.Empty;

    [BsonElement("phones")]
    public List<string> Phones { get; set; } = new();

    [BsonElement("emails")]
    public List<string> Emails { get; set; } = new();

    [BsonElement("address")]
    public string Address { get; set; } = string.Empty;

    [BsonElement("nationality")]
    public string Nationality { get; set; } = string.Empty;

    [BsonElement("drivingLicenses")]
    public List<string> DrivingLicenses { get; set; } = new();

    [BsonElement("profilePhoto")]
    public string ProfilePhoto { get; set; } = string.Empty;

    [BsonElement("summary")]
    public string Summary { get; set; } = string.Empty;
}
