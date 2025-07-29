using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using PratikCV.Infrastructure.Settings;
using Microsoft.Extensions.Options;

namespace PratikCV.Api.Controllers;

/// <summary>
/// Sistem sağlık kontrolü için API controller'ı - AWS ECS Ready
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly MongoDbSettings _mongoDbSettings;
    private readonly ILogger<HealthController> _logger;

    public HealthController(IOptions<MongoDbSettings> mongoDbSettings, ILogger<HealthController> logger)
    {
        _mongoDbSettings = mongoDbSettings.Value;
        _logger = logger;
    }

    /// <summary>
    /// API'nin sağlık durumunu kontrol eder - ECS Health Check endpoint
    /// </summary>
    /// <returns>Sağlık durumu bilgisi</returns>
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            var healthStatus = new
            {
                status = "healthy",
                timestamp = DateTime.UtcNow,
                version = "1.0.0",
                environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown",
                server = Environment.MachineName,
                uptime = TimeSpan.FromMilliseconds(Environment.TickCount64).ToString(@"dd\.hh\:mm\:ss"),
                checks = new
                {
                    api = "healthy",
                    database = await CheckDatabaseHealth(),
                    memory = CheckMemoryUsage()
                }
            };

            _logger.LogInformation("Health check requested - Status: {Status}", healthStatus.status);
            return Ok(healthStatus);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Health check failed");
            return StatusCode(503, new { status = "unhealthy", error = ex.Message, timestamp = DateTime.UtcNow });
        }
    }

    /// <summary>
    /// Database bağlantısını kontrol eder
    /// </summary>
    private async Task<string> CheckDatabaseHealth()
    {
        try
        {
            var client = new MongoClient(_mongoDbSettings.ConnectionString);
            var database = client.GetDatabase(_mongoDbSettings.DatabaseName);
            
            // Ping database
            await database.RunCommandAsync((Command<MongoDB.Bson.BsonDocument>)"{ping:1}");
            return "healthy";
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Database health check failed");
            return "unhealthy";
        }
    }

    /// <summary>
    /// Memory kullanımını kontrol eder
    /// </summary>
    private object CheckMemoryUsage()
    {
        try
        {
            var process = System.Diagnostics.Process.GetCurrentProcess();
            var workingSet = process.WorkingSet64;
            var privateMemory = process.PrivateMemorySize64;
            
            return new
            {
                status = "healthy",
                workingSetMB = Math.Round(workingSet / (1024.0 * 1024.0), 2),
                privateMemoryMB = Math.Round(privateMemory / (1024.0 * 1024.0), 2)
            };
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Memory health check failed");
            return new { status = "unhealthy", error = ex.Message };
        }
    }

    /// <summary>
    /// MongoDB bağlantısını test eder
    /// </summary>
    /// <returns>MongoDB bağlantı durumu</returns>
    [HttpGet("mongodb")]
    public async Task<IActionResult> CheckMongoDB()
    {
        try
        {
            var client = new MongoClient(_mongoDbSettings.ConnectionString);
            var database = client.GetDatabase(_mongoDbSettings.DatabaseName);
            
            // Simple ping to test connection
            await database.RunCommandAsync((Command<MongoDB.Bson.BsonDocument>)"{ping:1}");
            
            return Ok(new 
            { 
                Status = "Connected",
                Database = _mongoDbSettings.DatabaseName,
                Timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new 
            { 
                Status = "Failed",
                Error = ex.Message,
                Timestamp = DateTime.UtcNow
            });
        }
    }
}
