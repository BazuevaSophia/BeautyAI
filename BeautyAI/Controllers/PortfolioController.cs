using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BeautyAI.Data;
using BeautyAI.Models;

[ApiController]
[Route("api/[controller]")]
public class PortfolioController : ControllerBase
{
    private readonly BeautyAIDbContext _context;
    private readonly ILogger<PortfolioController> _logger;

    public PortfolioController(BeautyAIDbContext context, ILogger<PortfolioController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("{artistId}")]
    public async Task<IActionResult> GetPortfolio(int artistId)
    {
        try
        {
            var artist = await _context.Artists
                .Include(a => a.Portfolio)
                .FirstOrDefaultAsync(a => a.ArtistId == artistId);

            if (artist == null)
            {
                return NotFound(new { message = "Artist not found" });
            }

            var portfolio = new
            {
                artist.Photo,
                artist.PersDescription,
                PortfolioPhotos = artist.Portfolio?.Photo ?? new List<string>()
            };

            return Ok(portfolio);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting portfolio");
            return StatusCode(500, new { message = "Server error" });
        }
    }
}