using Microsoft.EntityFrameworkCore;
using BeautyAI.Models;
using BeautyAI.Data;

var builder = WebApplication.CreateBuilder(args);

// Добавляем DbContext
builder.Services.AddDbContext<BeautyAIDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Добавляем контроллеры и представления
builder.Services.AddControllersWithViews();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=UsertController}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
