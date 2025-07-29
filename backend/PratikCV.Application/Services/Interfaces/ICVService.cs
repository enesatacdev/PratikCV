using PratikCV.Application.DTOs.CV;

namespace PratikCV.Application.Services.Interfaces;

public interface ICVService
{
    Task<CVDto?> GetByUserIdAsync(string userId);
    Task<List<CVDto>> GetAllByUserIdAsync(string userId); // Yeni method
    Task<CVDto> CreateAsync(CreateCVDto createCVDto);
    Task<CVDto> UpdateAsync(string userId, UpdateCVDto updateCVDto);
    Task<CVDto> UpdateByIdAsync(string id, UpdateCVDto updateCVDto); // Yeni method
    Task<bool> DeleteAsync(string userId);
    Task<bool> DeleteByIdAsync(string id); // Yeni method
    Task<List<CVDto>> GetAllActiveAsync();
    Task<CVDto?> GetByIdAsync(string id);
}
