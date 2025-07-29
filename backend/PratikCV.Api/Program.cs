using PratikCV.Application.Mappings;
using PratikCV.Application.Services.Implementations;
using PratikCV.Application.Services.Interfaces;
using PratikCV.Domain.Repositories;
using PratikCV.Infrastructure.Repositories;
using PratikCV.Infrastructure.Settings;
using PratikCV.Infrastructure.Data;
using PratikCV.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// MongoDB Configuration
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings"));

// JWT Configuration
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));

// Shopier Configuration
builder.Services.Configure<ShopierSettings>(
    builder.Configuration.GetSection("ShopierSettings"));

// Add services to the container
builder.Services.AddControllers();

// AutoMapper
builder.Services.AddAutoMapper(typeof(CVMappingProfile).Assembly);

// MongoDB Context
builder.Services.AddSingleton<MongoDbContext>();

// Repository registration
builder.Services.AddScoped<ICVRepository, CVRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Service registration
builder.Services.AddScoped<ICVService, CVService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IUserService, UserService>();

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings!.SecretKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            // Development ortamında localhost'a izin ver
            policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        }
        else
        {
            // Production ortamında belirli domainlere izin ver
            policy.WithOrigins(
                "https://pratikcv.net", 
                "https://www.pratikcv.net",
                "http://pratikcv-env.eba-ehraejcc.eu-north-1.elasticbeanstalk.com"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
        }
    });
});

// Add Swagger services (her ortamda)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo 
    { 
        Title = "PratikCV API", 
        Version = "v1",
        Description = "CV Management System API",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "PratikCV Team",
            Email = "info@pratikcv.com"
        }
    });
    
    // Include XML comments for better documentation
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

// Configure the HTTP request pipeline.
// Enable Swagger UI (her ortamda)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "PratikCV API v1");
    c.RoutePrefix = "swagger"; // Swagger UI will be available at /swagger
    c.DocumentTitle = "PratikCV API Documentation";
    c.DisplayRequestDuration();
    c.EnableDeepLinking();
    c.EnableFilter();
    c.ShowExtensions();
});

app.UseHttpsRedirection();

// Use CORS
app.UseCors("AllowFrontend");

// Use Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
