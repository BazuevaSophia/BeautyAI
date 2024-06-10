using BeautyAI.Data;
using BeautyAI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class MyServiceController : ControllerBase
{
    private readonly BeautyAIDbContext _context;
    private readonly ILogger<MyServiceController> _logger;
    private readonly IHttpClientFactory _httpClientFactory;

    public MyServiceController(BeautyAIDbContext context, ILogger<MyServiceController> logger, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet]
    public async Task<IActionResult> GetServices()
    {
        var artistId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var services = await _context.Services.Where(s => s.ArtistId == int.Parse(artistId)).ToListAsync();
        return Ok(services);
    }

    [HttpPost]
    public async Task<IActionResult> AddService([FromBody] Service service)
    {
        service.ArtistId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        _context.Services.Add(service);
        await _context.SaveChangesAsync();
        return Ok(service);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateService(int id, [FromBody] Service service)
    {
        if (id != service.ServiceId)
            return BadRequest();

        var existingService = await _context.Services.FindAsync(id);
        if (existingService == null)
            return NotFound();

        existingService.Name = service.Name;
        existingService.Description = service.Description;
        existingService.Duration = service.Duration;
        existingService.Price = service.Price;
        existingService.Photo = service.Photo;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteService(int id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service == null)
            return NotFound();

        _context.Services.Remove(service);
        await _context.SaveChangesAsync();
        return NoContent();
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

            using (var httpClient = _httpClientFactory.CreateClient())
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

                        var imgurResponse = JsonConvert.DeserializeObject<ImgurUploadResponseAlt>(responseString);
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

public class ImgurUploadResponseAlt
{
    public ImgurUploadDataAlt Data { get; set; }
}

public class ImgurUploadDataAlt
{
    public string Link { get; set; }
}
