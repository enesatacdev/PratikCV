using MongoDB.Driver;
using PratikCV.Domain.Entities;
using PratikCV.Domain.Repositories;
using PratikCV.Infrastructure.Data;

namespace PratikCV.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<User> _users;

    public UserRepository(MongoDbContext context)
    {
        _users = context.Users;
    }

    public async Task<User?> GetByIdAsync(string id)
    {
        return await _users.Find(u => u.Id == id && !u.IsDeleted).FirstOrDefaultAsync();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _users.Find(u => u.Email == email && !u.IsDeleted).FirstOrDefaultAsync();
    }

    public async Task<User> CreateAsync(User user)
    {
        user.CreatedAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;
        await _users.InsertOneAsync(user);
        return user;
    }

    public async Task<User> UpdateAsync(User user)
    {
        user.UpdatedAt = DateTime.UtcNow;
        await _users.ReplaceOneAsync(u => u.Id == user.Id, user);
        return user;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var user = await GetByIdAsync(id);
        if (user == null) return false;

        user.IsDeleted = true;
        user.UpdatedAt = DateTime.UtcNow;
        await UpdateAsync(user);
        return true;
    }

    public async Task<bool> ExistsAsync(string email)
    {
        return await _users.CountDocumentsAsync(u => u.Email == email && !u.IsDeleted) > 0;
    }
}
