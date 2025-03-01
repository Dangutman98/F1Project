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


// Add HttpClient and Database Access Layer (DAL)
builder.Services.AddHttpClient<DriverDal>();
builder.Services.AddSingleton<DriverDal>(provider =>
{
    var httpClient = provider.GetRequiredService<HttpClient>();
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    return new DriverDal(httpClient, connectionString);
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

