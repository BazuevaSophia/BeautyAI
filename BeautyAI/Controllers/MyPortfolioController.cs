using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BeautyAI.Data;
using BeautyAI.Models;
using System.Security.Claims;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace BeautyAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MyPortfolioController : ControllerBase
    {
        private readonly BeautyAIDbContext _context;
        private readonly ILogger<MyPortfolioController> _logger;

        public MyPortfolioController(BeautyAIDbContext context, ILogger<MyPortfolioController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetPortfolio()
        {
            var artistId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var artist = await _context.Artists.Include(a => a.Portfolio).FirstOrDefaultAsync(a => a.ArtistId == artistId);
            if (artist == null || artist.Portfolio == null)
            {
                return NotFound(new { message = "Portfolio not found" });
            }

            return Ok(artist.Portfolio.Photo);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddPhoto([FromBody] PortfolioPhotoRequest request)
        {
            var artistId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var artist = await _context.Artists.Include(a => a.Portfolio).FirstOrDefaultAsync(a => a.ArtistId == artistId);
            if (artist == null || artist.Portfolio == null)
            {
                return NotFound(new { message = "Portfolio not found" });
            }

            artist.Portfolio.Photo.Add(request.PhotoUrl);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Photo added successfully" });
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeletePhoto([FromBody] PortfolioPhotoRequest request)
        {
            var artistId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var artist = await _context.Artists.Include(a => a.Portfolio).FirstOrDefaultAsync(a => a.ArtistId == artistId);
            if (artist == null || artist.Portfolio == null)
            {
                return NotFound(new { message = "Portfolio not found" });
            }

            artist.Portfolio.Photo.Remove(request.PhotoUrl);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Photo deleted successfully" });
        }

        [HttpPost("uploadPhoto")]
        public async Task<IActionResult> UploadPhoto([FromForm] IFormFile photo)
        {
            if (photo == null || photo.Length == 0)
            {
                return BadRequest(new { message = "Фото не предоставлено." });
            }

            try
            {
                var artistId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var artist = await _context.Artists.Include(a => a.Portfolio).FirstOrDefaultAsync(a => a.ArtistId == artistId);
                if (artist == null)
                {
                    return NotFound(new { message = "Профиль визажиста не найден." });
                }

                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Client-ID", "de3f8ae7d493aae");
                    using (var content = new MultipartFormDataContent())
                    {
                        using (var ms = new MemoryStream())
                        {
                            await photo.CopyToAsync(ms);
                            var bytes = ms.ToArray();
                            content.Add(new ByteArrayContent(bytes), "image", photo.FileName);
                            var response = await httpClient.PostAsync("https://api.imgur.com/3/image", content);
                            var responseString = await response.Content.ReadAsStringAsync();

                            if (!response.IsSuccessStatusCode)
                            {
                                return StatusCode((int)response.StatusCode, new { message = "Ошибка при загрузке фото на Imgur." });
                            }

                            var imgurResponse = JsonConvert.DeserializeObject<ImgurUploadResponse>(responseString);
                            if (imgurResponse == null || imgurResponse.Data == null || string.IsNullOrEmpty(imgurResponse.Data.Link))
                            {
                                return StatusCode(500, new { message = "Некорректный ответ от Imgur." });
                            }

                            artist.Portfolio.Photo.Add(imgurResponse.Data.Link);
                        }
                    }
                }

                _context.Artists.Update(artist);
                await _context.SaveChangesAsync();

                return Ok(new { photo = artist.Portfolio.Photo.Last() });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при загрузке фото");
                return StatusCode(500, new { message = "Произошла ошибка на сервере" });
            }
        }
    }

    public class PortfolioPhotoRequest
    {
        public string PhotoUrl { get; set; } = string.Empty;
    }

    public class ImgurUploadResponse
    {
        public ImgurUploadData Data { get; set; }
    }

    public class ImgurUploadData
    {
        public string Link { get; set; }
    }
}
