using BeautyAI.Controllers;
using BeautyAI.Data;
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
}
