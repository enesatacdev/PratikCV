using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PratikCV.Domain.Entities;
using PratikCV.Infrastructure.Settings;

namespace PratikCV.Infrastructure.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;
    private readonly MongoDbSettings _settings;

    public MongoDbContext(IOptions<MongoDbSettings> settings)
    {
        _settings = settings.Value;
        var client = new MongoClient(_settings.ConnectionString);
        _database = client.GetDatabase(_settings.DatabaseName);
        
        // Index'leri oluştur
        CreateIndexes();
    }

    public IMongoCollection<CVDocument> CVs => 
        _database.GetCollection<CVDocument>(_settings.CVCollectionName);
    
    public IMongoCollection<User> Users => 
        _database.GetCollection<User>(_settings.UserCollectionName);

    private void CreateIndexes()
    {
        // CV collection için user bazlı index
        var cvIndexKeys = Builders<CVDocument>.IndexKeys.Ascending(cv => cv.UserId);
        CVs.Indexes.CreateOne(new CreateIndexModel<CVDocument>(cvIndexKeys));

        // User collection için email bazlı unique index
        var userEmailIndexKeys = Builders<User>.IndexKeys.Ascending(u => u.Email);
        var userEmailIndexOptions = new CreateIndexOptions { Unique = true };
        Users.Indexes.CreateOne(new CreateIndexModel<User>(userEmailIndexKeys, userEmailIndexOptions));
    }
}
