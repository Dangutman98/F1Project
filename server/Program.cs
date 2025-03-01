using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using server.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Add DbContext with SQL Server connection string
// Use F1ProjectDbContext
builder.Services.AddDbContext<F1ProjectDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("F1ProjectDb")));


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

