using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Models;
using server.Data;
using server.DAL;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Add controllers with Newtonsoft.Json for JSON serialization
builder.Services.AddControllers()
    .AddNewtonsoftJson(); // Add this line to use Newtonsoft.Json for JSON serialization

// Configure DbContext for SQL Server
builder.Services.AddDbContext<server.Data.F1ProjectDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("F1ProjectDb"))); // Ensure connection string is correctly set in appsettings.json

// Add services for Swagger (for API documentation)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register HttpClient for Dependency Injection
builder.Services.AddHttpClient(); // Register HttpClient for Dependency Injection

// Register DriverDal for Dependency Injection
builder.Services.AddScoped<DriverDal>(provider =>
{
    var httpClient = provider.GetRequiredService<HttpClient>(); // Get HttpClient instance
    var connectionString = builder.Configuration.GetConnectionString("F1ProjectDb"); // Get connection string from configuration
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'F1ProjectDb' is not configured.");
    }
    return new DriverDal(connectionString, httpClient); // Pass both to the DriverDal constructor
});

// Register TeamDal for Dependency Injection
builder.Services.AddScoped<TeamDal>(provider =>
{
    var httpClient = provider.GetRequiredService<HttpClient>(); // Get HttpClient instance
    var connectionString = builder.Configuration.GetConnectionString("F1ProjectDb"); // Get connection string from configuration
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'F1ProjectDb' is not configured.");
    }
    return new TeamDal(connectionString, httpClient); // Pass both to the TeamDal constructor
});

// Enable CORS (Cross-Origin Resource Sharing)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder.AllowAnyOrigin() // Allows any origin
               .AllowAnyMethod() // Allows any HTTP method
               .AllowAnyHeader(); // Allows any header
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline for Swagger and routing
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // Automatically serves Swagger UI in development environment
}

app.UseHttpsRedirection(); // Ensures HTTP requests are redirected to HTTPS
app.UseAuthorization(); // Enable authorization middleware

// Enable CORS in the HTTP request pipeline
app.UseCors("AllowAllOrigins"); // Use the CORS policy

app.MapControllers(); // Map controllers to routes

// Run the application
app.Run();
