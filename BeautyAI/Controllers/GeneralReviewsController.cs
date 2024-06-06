using Microsoft.AspNetCore.Mvc;
using BeautyAI.Models;
using BeautyAI.Data;
using System.Net.Http.Headers;
using System.IO;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class GeneralReviewsController : ControllerBase
{
    private readonly BeautyAIDbContext _context;
    private readonly ILogger<GeneralReviewsController> _logger;

    public GeneralReviewsController(BeautyAIDbContext context, ILogger<GeneralReviewsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetReviews()
    {
        try
        {
            var reviews = await _context.All_Reviews
                .Select(r => new
                {
                    r.ReviewId2,
                    r.UserId,
                    UserName = r.User.Name,
                    r.Comment,
                    r.Photo
                })
                .ToListAsync();

            return Ok(reviews);
        }
        catch (Exception ex)
        {
            _logger.LogError("Ошибка при получении отзывов: {Error}", ex.ToString());
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> AddReview([FromForm] ReviewInputModel reviewModel)
    {
        try
        {
            var user = await _context.Users.FindAsync(reviewModel.UserId);
            if (user == null)
            {
                return NotFound("Пользователь не найден.");
            }

            var review = new All_review
            {
                UserId = reviewModel.UserId,
                Comment = reviewModel.Comment,
                Photo = new List<string>()
            };

            if (reviewModel.Photo != null)
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

            _context.All_Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                review.ReviewId2,
                review.UserId,
                UserName = user.Name,
                review.Comment,
                review.Photo
            });
        }
        catch (Exception ex)
        {
            _logger.LogError("Ошибка при добавлении отзыва: {Error}", ex.ToString());
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }

    [HttpDelete("{reviewId}")]
    public async Task<IActionResult> DeleteReview(int reviewId)
    {
        try
        {
            var review = await _context.All_Reviews.FindAsync(reviewId);
            if (review == null)
            {
                return NotFound("Отзыв не найден.");
            }

            _context.All_Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError("Ошибка при удалении отзыва: {Error}", ex.ToString());
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }
    }
}

public class ReviewInputModel
{
    public int UserId { get; set; }
    public string Comment { get; set; }
    public IFormFile Photo { get; set; }
}

public class ImgurResponse
{
    [JsonProperty("data")]
    public ImgurData Data { get; set; }
}

public class ImgurData
{
    [JsonProperty("link")]
    public string Link { get; set; }
}
