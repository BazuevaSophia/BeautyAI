using Microsoft.AspNetCore.Mvc;
using BeautyAI.Data;
using BeautyAI.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace BeautyAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthArtistController : ControllerBase
    {
        private readonly BeautyAIDbContext _context;
        private readonly ILogger<AuthArtistController> _logger;

        public AuthArtistController(BeautyAIDbContext context, ILogger<AuthArtistController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] ArtistLoginModel loginModel)
        {
            try
            {
                var artist = await _context.Artists.SingleOrDefaultAsync(a => a.Phone == loginModel.Phone);

                if (artist == null || artist.Password != (loginModel.Password ?? string.Empty))
                {
                    _logger.LogWarning("Вход не выполнен. Неверные учетные данные.");
                    return Unauthorized(new { message = "Неверные учетные данные." });
                }

                
                _logger.LogInformation("Роль пользователя: {Role}", artist.Role);

                if (artist.Role.Trim() != "визажист")
                {
                    _logger.LogWarning("Вход не выполнен. Пользователь не является визажистом.");
                    return Unauthorized(new { message = "Вход разрешен только для визажистов." });
                }

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, artist.ArtistId.ToString()),
                    new Claim(ClaimTypes.Name, artist.Name),
                    new Claim(ClaimTypes.Role, artist.Role)
                };

                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(60)
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);

                _logger.LogInformation("Пользователь {Phone} успешно вошел в систему.", artist.Phone);
                return Ok(new { message = "Успешный вход.", role = artist.Role });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при попытке входа в систему");
                return StatusCode(500, new { message = "Произошла ошибка на сервере" });
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                _logger.LogInformation("Пользователь успешно вышел из системы.");
                return Ok(new { message = "Успешный выход." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при попытке выхода из системы");
                return StatusCode(500, new { message = "Произошла ошибка на сервере" });
            }
        }
    }
}
