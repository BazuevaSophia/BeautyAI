using BeautyAI.Controllers;
using BeautyAI.Data;
using BeautyAI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ArtistsController : ControllerBase
{
    private readonly BeautyAIDbContext _context;
    private readonly ILogger<ArtistsController> _logger;

    public ArtistsController(BeautyAIDbContext context, ILogger<ArtistsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("all-artists")]
    public async Task<IActionResult> GetAllArtists()
    {
        try
        {
            var artists = await _context.Artists.Select(a => new
            {
                ArtistId = a.ArtistId,
                Name = a.Name,
                Image = a.Photo
            }).ToListAsync();

            return Ok(artists);
        }
        catch (Exception ex)
        {
            _logger.LogError("Ошибка при получении списка артистов: {Error}", ex.ToString());
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }

    [HttpGet("{artistId}/reviews")]
    public async Task<IActionResult> GetReviewsByArtist(int artistId)
    {
        try
        {
            var reviews = await _context.Reviews
                .Where(r => r.ArtistId == artistId)
                .Select(r => new
                {
                    r.ReviewId,
                    r.UserId,
                    UserName = r.User.Name,
                    r.Rating,
                    r.Comment,
                    Photos = r.Photo ?? new List<string>()
                }).ToListAsync();

            return Ok(reviews);
        }
        catch (Exception ex)
        {
            _logger.LogError("Ошибка при получении отзывов: {Error}", ex.ToString());
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }

    [HttpGet("{artistId}/signups")]
    public async Task<IActionResult> GetSignUpsByArtist(int artistId)
    {
        try
        {
            var signUps = await _context.SignUps
                .Where(s => s.ArtistId == artistId)
                .Select(s => new
                {
                    s.SignUpId,
                    s.DayOfWeek,
                    s.Times,
                    s.ArtistId
                }).ToListAsync();

            return Ok(signUps);
        }
        catch (Exception ex)
        {
            _logger.LogError("Ошибка при получении записей: {Error}", ex.ToString());
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }

    [HttpPost("{artistId}/signups")]
    public async Task<IActionResult> UpdateSignUps(int artistId, [FromBody] List<SignUp> signUps)
    {
        try
        {
            var existingSignUps = _context.SignUps.Where(s => s.ArtistId == artistId).ToList();
            _context.SignUps.RemoveRange(existingSignUps);
            await _context.SignUps.AddRangeAsync(signUps);
            await _context.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError("Ошибка при обновлении записей: {Error}", ex.ToString());
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }

    [HttpGet("{artistId}/services")]
    public async Task<IActionResult> GetServicesByArtist(int artistId)
    {
        try
        {
            var services = await _context.Services
                .Where(s => s.ArtistId == artistId)
                .Select(s => new
                {
                    s.ServiceId,
                    s.Name,
                    s.Description,
                    s.Price,
                    s.Duration,
                    s.Photo
                }).ToListAsync();

            return Ok(services);
        }
        catch (Exception ex)
        {
            _logger.LogError("Ошибка при получении услуг: {Error}", ex.ToString());
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }
}
