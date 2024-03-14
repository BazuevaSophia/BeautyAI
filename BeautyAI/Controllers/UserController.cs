using Microsoft.AspNetCore.Mvc;
using BeautyAI.Models;
using BeautyAI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BeautyAI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly BeautyAIDbContext _context;
    private readonly ILogger<UserController> _logger;

    public UserController(BeautyAIDbContext context, ILogger<UserController> logger)
    {
        _context = context;
        _logger = logger; 
    }

    [HttpPost("register")]
    public async Task<ActionResult<User>> Register(User user)
    {
        _logger.LogInformation("Регистрация нового пользователя: {Email}", user.Email); 

        var userExists = await _context.Users.AnyAsync(u => u.Email == user.Email);
        if (userExists)
        {
            _logger.LogWarning("Пользователь с email {Email} уже существует.", user.Email); 
            return BadRequest("Пользователь с таким email уже существует.");
        }

        user.Role = "Клиент";

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Пользователь {Email} успешно зарегистрирован.", user.Email); 

        return Ok(user);
    }
}
