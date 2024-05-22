using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BeautyAI.Data;
using BeautyAI.Models;
using System.Security.Claims;

namespace BeautyAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrendsController : ControllerBase
    {
        private readonly BeautyAIDbContext _context;
        private readonly ILogger<TrendsController> _logger;

        public TrendsController(BeautyAIDbContext context, ILogger<TrendsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("all-trends")]
        public async Task<IActionResult> GetAllTrends()
        {
            try
            {
                var trends = await _context.Trends.ToListAsync();
                return Ok(trends);
            }
            catch (Exception ex)
            {
                _logger.LogError("Ошибка при получении списка трендов: {Error}", ex.ToString());
                return StatusCode(500, "Internal Server Error: " + ex.Message);
            }
        }

        [HttpGet("search-trends")]
        public async Task<IActionResult> SearchTrends(string query = "", int? year = null, string season = "")
        {
            try
            {
                var trendsQuery = _context.Trends.AsQueryable();

                if (!string.IsNullOrEmpty(query))
                {
                    trendsQuery = trendsQuery.Where(t => t.Name.Contains(query));
                }

                if (year.HasValue)
                {
                    trendsQuery = trendsQuery.Where(t => t.Year == year);
                }

                if (!string.IsNullOrEmpty(season))
                {
                    trendsQuery = trendsQuery.Where(t => t.Season == season);
                }

                var trends = await trendsQuery.ToListAsync();
                return Ok(trends);
            }
            catch (Exception ex)
            {
                _logger.LogError("Ошибка при поиске трендов: {Error}", ex.ToString());
                return StatusCode(500, "Internal Server Error: " + ex.Message);
            }
        }

        [HttpPost("add-to-favorites")]
        public async Task<IActionResult> AddToFavorites([FromBody] int trendId)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized(new { message = "Пользователь не авторизован." });
            }

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await _context.Users.Include(u => u.FavoriteTrends).FirstOrDefaultAsync(u => u.UserId.ToString() == userId);

                if (user == null)
                {
                    return NotFound(new { message = "Пользователь не найден." });
                }

                var trend = await _context.Trends.FindAsync(trendId);
                if (trend == null)
                {
                    return NotFound(new { message = "Тренд не найден." });
                }

                user.FavoriteTrends.Add(trend);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Тренд добавлен в избранное." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при добавлении тренда в избранное");
                return StatusCode(500, new { message = "Произошла ошибка на сервере" });
            }
        }
    }
}
