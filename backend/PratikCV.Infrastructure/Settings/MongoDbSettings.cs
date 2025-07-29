namespace PratikCV.Infrastructure.Settings;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
    public string CVCollectionName { get; set; } = "cvs";
    public string UserCollectionName { get; set; } = "users";
}
