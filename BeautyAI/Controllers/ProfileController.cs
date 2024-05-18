using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BeautyAI.Data;
using BeautyAI.Models;

namespace BeautyAI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly BeautyAIDbContext _context;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(BeautyAIDbContext context, ILogger<ProfileController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("getProfile")]
    public async Task<IActionResult> GetProfile()
    {
        if (!User.Identity.IsAuthenticated)
        {
            return Unauthorized(new { message = "Пользователь не авторизован." });
        }

        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _context.Users
                                     .Where(u => u.UserId.ToString() == userId)
                                     .Select(u => new {
                                         u.Name,
                                         u.Email,
                                         u.Phone,
                                         u.Photo
                                     })
                                     .FirstOrDefaultAsync();
            if (user == null)
            {
                _logger.LogWarning("Профиль пользователя не найден.");
                return NotFound(new { message = "Профиль пользователя не найден." });
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при попытке получения данных профиля");
            return StatusCode(500, new { message = "Произошла ошибка на сервере" });
        }
    }
}
