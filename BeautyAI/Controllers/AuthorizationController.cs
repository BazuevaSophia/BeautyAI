using Microsoft.AspNetCore.Mvc;
using BeautyAI.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace BeautyAI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthorizationController : ControllerBase
{
    private readonly BeautyAIDbContext _context;
    private readonly ILogger<AuthorizationController> _logger;

    public AuthorizationController(BeautyAIDbContext context, ILogger<AuthorizationController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
    {
        try
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Phone == loginModel.Phone);

            if (user == null || user.Password != loginModel.Password)
            {
                _logger.LogWarning("Вход не выполнен. Неверные учетные данные.");
                return Unauthorized(new { message = "Неверные учетные данные." });
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Name)
            };

            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(60)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);

            _logger.LogInformation("Пользователь {Phone} успешно вошел в систему.", user.Phone);
            return Ok(new { message = "Успешный вход." });
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

public class LoginModel
{
    public string Phone { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
