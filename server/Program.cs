using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.DAL;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Add controllers with Newtonsoft.Json for JSON serialization
builder.Services.AddControllers()
    .AddNewtonsoftJson(); // Add this line to use Newtonsoft.Json for JSON serialization

// Configure DbContext for SQL Server
builder.Services.AddDbContext<F1ProjectDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("F1ProjectDb"))); // Ensure connection string is correctly set in appsettings.json

// Add services for Swagger (for API documentation)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register HttpClient for Dependency Injection
builder.Services.AddHttpClient(); // Register HttpClient for Dependency Injection

// Register DriverDal with constructor dependencies (HttpClient and connection string)
builder.Services.AddScoped<DriverDal>(provider =>
{
    var httpClient = provider.GetRequiredService<HttpClient>(); // Get HttpClient instance
    var connectionString = builder.Configuration.GetConnectionString("F1ProjectDb"); // Get connection string from configuration
    return new DriverDal(connectionString, httpClient); // Pass both to the DriverDal constructor
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

app.MapControllers(); // Map controllers to routes

// Run the application
app.Run();
