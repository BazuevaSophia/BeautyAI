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
    public async Task<IActionResult> AddService([FromForm] ServiceCreateModel serviceModel)
    {
        serviceModel.ArtistId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var service = new Service
        {
            Name = serviceModel.Name,
            Description = serviceModel.Description,
            Price = serviceModel.Price,
            Duration = serviceModel.Duration,
            ArtistId = serviceModel.ArtistId,
            Photo = new List<string>()
        };

        if (serviceModel.Photo != null && serviceModel.Photo.Length > 0)
        {
            foreach (var photo in serviceModel.Photo)
            {
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

                            var imgurResponse = JsonConvert.DeserializeObject<ImgurUploadResponse>(responseString);
                            if (imgurResponse == null || imgurResponse.Data == null || string.IsNullOrEmpty(imgurResponse.Data.Link))
                            {
                                return StatusCode(500, new { message = "Некорректный ответ от Imgur." });
                            }

                            service.Photo.Add(imgurResponse.Data.Link);
                        }
                    }
                }
            }
        }

        _context.Services.Add(service);
        await _context.SaveChangesAsync();
        return Ok(service);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateService(int id, [FromForm] ServiceUpdateModel serviceUpdateModel)
    {
        if (id != serviceUpdateModel.ServiceId)
            return BadRequest();

        var existingService = await _context.Services.FindAsync(id);
        if (existingService == null)
            return NotFound();

        existingService.Name = serviceUpdateModel.Name;
        existingService.Description = serviceUpdateModel.Description;
        existingService.Duration = serviceUpdateModel.Duration;
        existingService.Price = serviceUpdateModel.Price;

        await _context.SaveChangesAsync();
        return Ok(existingService);
    }

    public class ServiceUpdateModel
    {
        public int ServiceId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Duration { get; set; }
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

                        var imgurResponse = JsonConvert.DeserializeObject<ImgurUploadResponse>(responseString);
                        if (imgurResponse == null || imgurResponse.Data == null || string.IsNullOrEmpty(imgurResponse.Data.Link))
                        {
                            return StatusCode(500, new { message = "Некорректный ответ от Imgur." });
                        }

                        return Ok(new { photoUrl = imgurResponse.Data.Link });
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при загрузке фото");
            return StatusCode(500, new { message = "Произошла ошибка на сервере" });
        }
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteService(int id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service == null)
        {
            return NotFound();
        }

        _context.Services.Remove(service);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    public class ImgurUploadResponse
    {
        public ImgurUploadData Data { get; set; }
    }

    public class ImgurUploadData
    {
        public string Link { get; set; }
    }
    public class ServiceCreateModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Duration { get; set; }
        public int ArtistId { get; set; }
        public IFormFile[] Photo { get; set; }
    }
}