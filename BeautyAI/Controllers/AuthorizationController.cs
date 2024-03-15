using Microsoft.AspNetCore.Mvc;
using BeautyAI.Models;
using BeautyAI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;

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
    public async Task<ActionResult> Login([FromBody] LoginModel loginModel)
    {
        try
        {
            var user = await _context.Users
                                     .SingleOrDefaultAsync(u => u.Phone == loginModel.Phone && u.Password == loginModel.Password);

            if (user == null)
            {
                _logger.LogWarning("Вход не выполнен. Пользователь не найден или неверный пароль.");
                return NotFound(new { message = "Пользователь не найден или неверный пароль." });
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Name),
                
            };

            var claimsIdentity = new ClaimsIdentity(claims, "Cookies");

           
            await HttpContext.SignInAsync("Cookies", new ClaimsPrincipal(claimsIdentity));

            _logger.LogInformation("Пользователь {Email} успешно вошел в систему.", user.Email);
            return Redirect("/profile"); 
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при попытке входа в систему");
            return StatusCode(500, new { message = "Произошла ошибка на сервере" });
        }
    }
}

public class LoginModel
{
    public string Phone { get; set; } = string.Empty;
    public string Password { get; set; }= string.Empty;
}
