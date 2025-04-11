using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Models;
using server.Data;
using server.DAL;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add logging
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
});

// Add controllers with Newtonsoft.Json for JSON serialization
builder.Services.AddControllers()
    .AddNewtonsoftJson(); // Add this line to use Newtonsoft.Json for JSON serialization

// Configure DbContext for SQL Server
builder.Services.AddDbContext<server.Data.F1ProjectDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("igroup179_prod"))); // Ensure connection string is correctly set in appsettings.json

// Add services for Swagger (for API documentation)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register HttpClient for Dependency Injection
builder.Services.AddHttpClient(); // Register HttpClient for Dependency Injection


// Register DriverDal for Dependency Injection
builder.Services.AddScoped<DriverDal>(provider =>
{
    var connectionString = builder.Configuration.GetConnectionString("igroup179_prod"); // Get connection string from configuration
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'igroup179_prod' is not configured.");
    }
    return new DriverDal(connectionString); // Only pass connection string
});

// Register TeamDal for Dependency Injection
builder.Services.AddScoped<TeamDal>(provider =>
{
    var connectionString = builder.Configuration.GetConnectionString("igroup179_prod"); // Get connection string from configuration
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'igroup179_prod' is not configured.");
    }
    return new TeamDal(connectionString); // Only pass connection string
});

// Register EventDAL for Dependency Injection
builder.Services.AddScoped<EventDAL>(provider =>
{
    var connectionString = builder.Configuration.GetConnectionString("igroup179_prod");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'igroup179_prod' is not configured.");
    }
    return new EventDAL(connectionString);
});

// Add DAL services
builder.Services.AddScoped<DriverStandingsDAL>();

// Enable CORS (Cross-Origin Resource Sharing)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder
            .WithOrigins(
                "http://localhost:5173",   // Development frontend URL
                "https://localhost:5173"   // HTTPS frontend URL
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .SetIsOriginAllowed(origin => true); // Allow any origin temporarily for debugging
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline for Swagger and routing
if (true)
{
    app.UseSwagger();
    app.UseSwaggerUI(); // Automatically serves Swagger UI in development environment
}

// Enable CORS before any other middleware
app.UseCors("AllowAllOrigins"); // Use the CORS policy

// Configure HTTPS after CORS
app.UseHsts(); // Enable HTTP Strict Transport Security (HSTS)
app.UseHttpsRedirection(); // Ensures HTTP requests are redirected to HTTPS
app.UseAuthorization(); // Enable authorization middleware

app.MapControllers(); // Map controllers to routes

// Run the application
app.Run();
