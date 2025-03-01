using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.DAL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Add DbContext with SQL Server connection string
// Use F1ProjectDbContext
builder.Services.AddDbContext<F1ProjectDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("F1ProjectDb")));


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Register HttpClient and DriverDal
builder.Services.AddHttpClient(); // Register HttpClient for Dependency Injection

builder.Services.AddScoped<DriverDal>(provider =>
{
    var httpClient = provider.GetRequiredService<HttpClient>(); // Get the HttpClient instance
    var connectionString = builder.Configuration.GetConnectionString("F1ProjectDb"); // Get connection string from configuration
    return new DriverDal(connectionString, httpClient); // Pass both to the DriverDal constructor
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();


app.Run();

