using MongoDB.Driver;
using PratikCV.Domain.Entities;
using PratikCV.Domain.Repositories;
using PratikCV.Infrastructure.Data;

namespace PratikCV.Infrastructure.Repositories;

public class CVRepository : ICVRepository
{
    private readonly IMongoCollection<CVDocument> _cvCollection;

    public CVRepository(MongoDbContext context)
    {
        _cvCollection = context.CVs;
    }

    public async Task<CVDocument?> GetByUserIdAsync(string userId)
    {
        return await _cvCollection
            .Find(cv => cv.UserId == userId && cv.IsActive)
            .FirstOrDefaultAsync();
    }

    // Yeni method: Kullanıcının tüm CV'lerini getir
    public async Task<List<CVDocument>> GetAllByUserIdAsync(string userId)
    {
        return await _cvCollection
            .Find(cv => cv.UserId == userId && cv.IsActive)
            .SortByDescending(cv => cv.UpdatedAt)
            .ToListAsync();
    }

    public async Task<CVDocument> CreateAsync(CVDocument cvDocument)
    {
        await _cvCollection.InsertOneAsync(cvDocument);
        return cvDocument;
    }

    public async Task<CVDocument> UpdateAsync(CVDocument cvDocument)
    {
        cvDocument.UpdatedAt = DateTime.UtcNow;
        
        var filter = Builders<CVDocument>.Filter.Eq(cv => cv.Id, cvDocument.Id);
        await _cvCollection.ReplaceOneAsync(filter, cvDocument);
        
        return cvDocument;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        // Soft delete - set IsActive to false
        var filter = Builders<CVDocument>.Filter.Eq(cv => cv.Id, id);
        var update = Builders<CVDocument>.Update
            .Set(cv => cv.IsActive, false)
            .Set(cv => cv.UpdatedAt, DateTime.UtcNow);

        var result = await _cvCollection.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> ExistsAsync(string userId)
    {
        var count = await _cvCollection
            .CountDocumentsAsync(cv => cv.UserId == userId && cv.IsActive);
        return count > 0;
    }

    public async Task<List<CVDocument>> GetAllActiveAsync()
    {
        return await _cvCollection
            .Find(cv => cv.IsActive)
            .SortByDescending(cv => cv.UpdatedAt)
            .ToListAsync();
    }

    public async Task<CVDocument?> GetByIdAsync(string id)
    {
        return await _cvCollection
            .Find(cv => cv.Id == id && cv.IsActive)
            .FirstOrDefaultAsync();
    }
}
