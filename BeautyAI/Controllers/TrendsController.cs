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

        public class AddToFavoritesRequest
        {
            public int TrendId { get; set; }
        }

        [HttpPost("add-to-favorites")]
        public async Task<IActionResult> AddToFavorites([FromBody] AddToFavoritesRequest request)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized(new { message = "Пользователь не авторизован." });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            try
            {
                var user = await _context.Users.Include(u => u.FavoriteTrends).FirstOrDefaultAsync(u => u.UserId.ToString() == userId);

                if (user == null)
                {
                    _logger.LogWarning("User not found: {UserId}", userId);
                    return NotFound(new { message = "Пользователь не найден." });
                }

                var existingFavorite = user.FavoriteTrends.FirstOrDefault(uf => uf.TrendId == request.TrendId);
                if (existingFavorite != null)
                {
                    _logger.LogWarning("Trend already in favorites: {TrendId}", request.TrendId);
                    return BadRequest(new { message = "Тренд уже добавлен в избранное." });
                }

                var trend = await _context.Trends.FindAsync(request.TrendId);
                if (trend == null)
                {
                    _logger.LogWarning("Trend not found: {TrendId}", request.TrendId);
                    return NotFound(new { message = "Тренд не найден." });
                }

                var userFavoriteTrend = new UserFavoriteTrend
                {
                    UserId = int.Parse(userId),
                    TrendId = trend.TrendId
                };

                _context.UserFavoriteTrends.Add(userFavoriteTrend);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Trend added to favorites successfully: {TrendId}, User ID: {UserId}", request.TrendId, userId);
                return Ok(new { message = "Тренд добавлен в избранное." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при добавлении тренда в избранное. User ID: {UserId}, Trend ID: {TrendId}", userId, request.TrendId);
                return StatusCode(500, new { message = "Произошла ошибка на сервере" });
            }
        }

        public class RemoveFromFavoritesRequest
        {
            public int TrendId { get; set; }
        }

        [HttpPost("remove-from-favorites")]
        public async Task<IActionResult> RemoveFromFavorites([FromBody] RemoveFromFavoritesRequest request)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized(new { message = "Пользователь не авторизован." });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            try
            {
                var user = await _context.Users.Include(u => u.FavoriteTrends).FirstOrDefaultAsync(u => u.UserId.ToString() == userId);

                if (user == null)
                {
                    _logger.LogWarning("User not found: {UserId}", userId);
                    return NotFound(new { message = "Пользователь не найден." });
                }

                var favoriteTrend = user.FavoriteTrends.FirstOrDefault(uf => uf.TrendId == request.TrendId);
                if (favoriteTrend == null)
                {
                    _logger.LogWarning("Trend not found in favorites: {TrendId}", request.TrendId);
                    return NotFound(new { message = "Тренд не найден в избранном." });
                }

                _context.UserFavoriteTrends.Remove(favoriteTrend);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Trend removed from favorites successfully: {TrendId}, User ID: {UserId}", request.TrendId, userId);
                return Ok(new { message = "Тренд убран из избранного." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении тренда из избранного. User ID: {UserId}, Trend ID: {TrendId}", userId, request.TrendId);
                return StatusCode(500, new { message = "Произошла ошибка на сервере" });
            }
        }

        [HttpGet("favorites")]
        public async Task<IActionResult> GetFavorites()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized(new { message = "Пользователь не авторизован." });
            }

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await _context.Users
                    .Include(u => u.FavoriteTrends)
                    .ThenInclude(ft => ft.Trend)
                    .FirstOrDefaultAsync(u => u.UserId.ToString() == userId);

                if (user == null)
                {
                    return NotFound(new { message = "Пользователь не найден." });
                }

                var favoriteTrends = user.FavoriteTrends.Select(ft => new {
                    ft.Trend.TrendId,
                    ft.Trend.Name,
                    ft.Trend.Description,
                    ft.Trend.Photo,
                    ft.Trend.Season,
                    ft.Trend.Year
                }).ToList();

                return Ok(favoriteTrends);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении избранных трендов");
                return StatusCode(500, new { message = "Произошла ошибка на сервере" });
            }
        }
    }
}
