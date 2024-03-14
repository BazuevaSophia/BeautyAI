using Microsoft.EntityFrameworkCore;
using BeautyAI.Models;
using BeautyAI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Configure CORS to allow specific origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("https://localhost:44476") // Замените этот URL на URL вашего клиентского приложения
                          .AllowAnyHeader()
                          .AllowAnyMethod());
                          
});

builder.Services.AddDbContext<BeautyAIDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors("AllowSpecificOrigin"); // Включите CORS middleware

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=User}/{action=Index}/{id?}"); // Убедитесь, что это правильный контроллер и действие

app.MapFallbackToFile("index.html");

app.Run();
