using PratikCV.Domain.Entities;

namespace PratikCV.Domain.Repositories;

public interface ICVRepository
{
    Task<CVDocument?> GetByUserIdAsync(string userId);
    Task<List<CVDocument>> GetAllByUserIdAsync(string userId); // Yeni method
    Task<CVDocument> CreateAsync(CVDocument cvDocument);
    Task<CVDocument> UpdateAsync(CVDocument cvDocument);
    Task<bool> DeleteAsync(string id);
    Task<bool> ExistsAsync(string userId);
    Task<List<CVDocument>> GetAllActiveAsync();
    Task<CVDocument?> GetByIdAsync(string id);
}
