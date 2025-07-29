using AutoMapper;
using PratikCV.Application.DTOs.CV;
using PratikCV.Application.Services.Interfaces;
using PratikCV.Domain.Entities;
using PratikCV.Domain.Repositories;

namespace PratikCV.Application.Services.Implementations;

public class CVService : ICVService
{
    private readonly ICVRepository _cvRepository;
    private readonly IMapper _mapper;

    public CVService(ICVRepository cvRepository, IMapper mapper)
    {
        _cvRepository = cvRepository;
        _mapper = mapper;
    }

    public async Task<CVDto?> GetByUserIdAsync(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new ArgumentException("User ID cannot be null or empty", nameof(userId));

        var cvDocument = await _cvRepository.GetByUserIdAsync(userId);
        return cvDocument != null ? _mapper.Map<CVDto>(cvDocument) : null;
    }

    // Yeni method: Kullanıcının tüm CV'lerini getir
    public async Task<List<CVDto>> GetAllByUserIdAsync(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new ArgumentException("User ID cannot be null or empty", nameof(userId));

        var cvDocuments = await _cvRepository.GetAllByUserIdAsync(userId);
        return _mapper.Map<List<CVDto>>(cvDocuments);
    }

    public async Task<CVDto> CreateAsync(CreateCVDto createCVDto)
    {
        if (createCVDto == null)
            throw new ArgumentNullException(nameof(createCVDto));

        if (string.IsNullOrWhiteSpace(createCVDto.UserId))
            throw new ArgumentException("User ID cannot be null or empty", nameof(createCVDto.UserId));

        // Multiple CV desteklemek için mevcut CV kontrolünü kaldırıyoruz
        // Her zaman yeni CV oluştur
        var cvDocument = _mapper.Map<CVDocument>(createCVDto);
        var createdCV = await _cvRepository.CreateAsync(cvDocument);
        
        return _mapper.Map<CVDto>(createdCV);
    }

    // Yeni method: ID ile CV güncelle
    public async Task<CVDto> UpdateByIdAsync(string id, UpdateCVDto updateCVDto)
    {
        if (string.IsNullOrWhiteSpace(id))
            throw new ArgumentException("ID cannot be null or empty", nameof(id));

        if (updateCVDto == null)
            throw new ArgumentNullException(nameof(updateCVDto));

        var existingCV = await _cvRepository.GetByIdAsync(id);
        if (existingCV == null)
            throw new InvalidOperationException($"CV not found with ID {id}");

        // Map update data to existing CV
        _mapper.Map(updateCVDto, existingCV);
        existingCV.UpdatedAt = DateTime.UtcNow;

        var updatedCV = await _cvRepository.UpdateAsync(existingCV);
        return _mapper.Map<CVDto>(updatedCV);
    }

    public async Task<CVDto> UpdateAsync(string userId, UpdateCVDto updateCVDto)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new ArgumentException("User ID cannot be null or empty", nameof(userId));

        if (updateCVDto == null)
            throw new ArgumentNullException(nameof(updateCVDto));

        var existingCV = await _cvRepository.GetByUserIdAsync(userId);
        if (existingCV == null)
            throw new InvalidOperationException($"CV not found for user {userId}");

        // Map update data to existing CV
        _mapper.Map(updateCVDto, existingCV);
        existingCV.UpdatedAt = DateTime.UtcNow;

        var updatedCV = await _cvRepository.UpdateAsync(existingCV);
        return _mapper.Map<CVDto>(updatedCV);
    }

    public async Task<bool> DeleteAsync(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new ArgumentException("User ID cannot be null or empty", nameof(userId));

        var existingCV = await _cvRepository.GetByUserIdAsync(userId);
        if (existingCV == null)
            return false;

        return await _cvRepository.DeleteAsync(existingCV.Id);
    }

    public async Task<List<CVDto>> GetAllActiveAsync()
    {
        var cvDocuments = await _cvRepository.GetAllActiveAsync();
        return _mapper.Map<List<CVDto>>(cvDocuments);
    }

    public async Task<CVDto?> GetByIdAsync(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            throw new ArgumentException("ID cannot be null or empty", nameof(id));

        var cvDocument = await _cvRepository.GetByIdAsync(id);
        return cvDocument != null ? _mapper.Map<CVDto>(cvDocument) : null;
    }

    // Yeni method: ID ile CV sil
    public async Task<bool> DeleteByIdAsync(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            throw new ArgumentException("ID cannot be null or empty", nameof(id));

        return await _cvRepository.DeleteAsync(id);
    }
}
