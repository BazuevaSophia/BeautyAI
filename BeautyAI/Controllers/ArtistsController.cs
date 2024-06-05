using System.Net.Http.Headers;
using BeautyAI.Controllers;
using BeautyAI.Data;
using BeautyAI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

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
                .Select(r => new ReviewDTO
                {
                    ReviewId = r.ReviewId,
                    UserId = r.UserId,
                    UserName = r.User.Name,
                    ArtistId = r.ArtistId,
                    Rating = r.Rating,
                    Comment = r.Comment,
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

    [HttpPost("{artistId}/reviews")]
    public async Task<IActionResult> AddReview(int artistId, [FromForm] ReviewModel reviewModel)
    {
        try
        {
            var user = await _context.Users.FindAsync(reviewModel.UserId); 
            if (user == null)
            {
                return NotFound("Пользователь не найден.");
            }

            var review = new Review
            {
                ArtistId = artistId,
                UserId = reviewModel.UserId,
                Comment = reviewModel.Comment,
                Rating = (short)reviewModel.Rating,
                Photo = new List<string>()
            };

            if (reviewModel.Photo != null && reviewModel.Photo.Length > 0)
            {
                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Client-ID", "de3f8ae7d493aae");
                    using (var content = new MultipartFormDataContent())
                    {
                        using (var ms = new MemoryStream())
                        {
                            await reviewModel.Photo.CopyToAsync(ms);
                            var bytes = ms.ToArray();
                            content.Add(new ByteArrayContent(bytes), "image", reviewModel.Photo.FileName);
                            var response = await httpClient.PostAsync("https://api.imgur.com/3/image", content);
                            var responseString = await response.Content.ReadAsStringAsync();

                            if (!response.IsSuccessStatusCode)
                            {
                                _logger.LogError("Ошибка при загрузке фото на Imgur: " + responseString);
                                return StatusCode((int)response.StatusCode, new { message = "Ошибка при загрузке фото на Imgur." });
                            }

                            var imgurResponse = JsonConvert.DeserializeObject<ImgurResponse>(responseString);
                            if (imgurResponse == null || imgurResponse.Data == null || string.IsNullOrEmpty(imgurResponse.Data.Link))
                            {
                                _logger.LogError("Некорректный ответ от Imgur: " + responseString);
                                return StatusCode(500, new { message = "Некорректный ответ от Imgur." });
                            }

                            review.Photo.Add(imgurResponse.Data.Link);
                        }
                    }
                }
            }

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            var reviewDTO = new ReviewDTO
            {
                ReviewId = review.ReviewId,
                UserId = review.UserId,
                UserName = user.Name,
                ArtistId = review.ArtistId,
                Rating = review.Rating,
                Comment = review.Comment,
                Photos = review.Photo
            };

            return Ok(reviewDTO);
        }
        catch (Exception ex)
        {
            _logger.LogError("Ошибка при добавлении отзыва: {Error}", ex.ToString());
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }

    [HttpDelete("reviews/{reviewId}")]
    public async Task<IActionResult> DeleteReview(int reviewId)
    {
        try
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null)
            {
                return NotFound("Отзыв не найден.");
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError("Ошибка при удалении отзыва: {Error}", ex.ToString());
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
