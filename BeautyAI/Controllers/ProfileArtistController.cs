using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BeautyAI.Data;
using BeautyAI.Models;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace BeautyAI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfileArtistController : ControllerBase
{
    private readonly BeautyAIDbContext _context;
    private readonly ILogger<ProfileArtistController> _logger;

    public ProfileArtistController(BeautyAIDbContext context, ILogger<ProfileArtistController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("getProfile")]
    public async Task<IActionResult> GetProfile()
    {
        try
        {
            var artistId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var artist = await _context.Artists
                                      .Where(a => a.ArtistId.ToString() == artistId)
                                      .Select(a => new {
                                          a.ArtistId,
                                          a.Name,
                                          a.Phone,
                                          a.Photo,
                                          a.Rating,
                                          a.PersDescription,
                                          a.Surname
                                      })
                                      .FirstOrDefaultAsync();
            if (artist == null)
            {
                _logger.LogWarning("Профиль визажиста не найден.");
                return NotFound(new { message = "Профиль визажиста не найден." });
            }

            return Ok(artist);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при попытке получения данных профиля");
            return StatusCode(500, new { message = "Произошла ошибка на сервере" });
        }
    }

    [HttpPost("updatePhoto")]
    public async Task<IActionResult> UpdatePhoto([FromBody] PhotoModel photoModel)
    {
        try
        {
            var artistId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(artistId, out int artistIdInt))
            {
                _logger.LogWarning("Некорректный формат идентификатора визажиста.");
                return BadRequest(new { message = "Некорректный формат идентификатора визажиста." });
            }
            var artist = await _context.Artists.FindAsync(artistIdInt);
            if (artist == null)
            {
                _logger.LogWarning("Профиль визажиста не найден.");
                return NotFound(new { message = "Профиль визажиста не найден." });
            }

            artist.Photo = photoModel.PhotoUrl;
            _context.Artists.Update(artist);
            await _context.SaveChangesAsync();

            return Ok(new { photo = artist.Photo, message = "Фото обновлено успешно." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при обновлении фото");
            return StatusCode(500, new { message = "Произошла ошибка на сервере" });
        }
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
            var artistId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(artistId, out int artistIdInt))
            {
                _logger.LogWarning("Некорректный формат идентификатора визажиста.");
                return BadRequest(new { message = "Некорректный формат идентификатора визажиста." });
            }
            var artist = await _context.Artists.FindAsync(artistIdInt);
            if (artist == null)
            {
                _logger.LogWarning("Профиль визажиста не найден.");
                return NotFound(new { message = "Профиль визажиста не найден." });
            }

            using (var httpClient = new HttpClient())
            {
                _logger.LogInformation("Начало загрузки фото на Imgur");
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

                        _logger.LogInformation("Ответ от Imgur: " + responseString);

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

                        artist.Photo = imgurResponse.Data.Link;
                    }
                }
            }

            _context.Artists.Update(artist);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Фото визажиста успешно обновлено");
            return Ok(new { photo = artist.Photo });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при загрузке фото");
            return StatusCode(500, new { message = "Произошла ошибка на сервере" });
        }
    }

    [HttpPost("updateProfile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateArtistProfileModel model)
    {
        try
        {
            var artistId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(artistId, out int artistIdInt))
            {
                return BadRequest(new { message = "Некорректный формат идентификатора визажиста." });
            }

            var artist = await _context.Artists.FindAsync(artistIdInt);
            if (artist == null)
            {
                return NotFound(new { message = "Профиль визажиста не найден." });
            }

            if (!string.IsNullOrEmpty(model.OldPassword) && !string.IsNullOrEmpty(model.NewPassword))
            {
                if (artist.Password != model.OldPassword)
                {
                    return BadRequest(new { message = "Старый пароль неверен." });
                }

                artist.Password = model.NewPassword;
            }

            if (!string.IsNullOrEmpty(model.Phone))
            {
                artist.Phone = model.Phone;
            }

            if (!string.IsNullOrEmpty(model.PersDescription))
            {
                artist.PersDescription = model.PersDescription;
            }

            _context.Artists.Update(artist);
            await _context.SaveChangesAsync();

            return Ok(new { artist.Phone, artist.PersDescription, message = "Данные профиля успешно обновлены." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при обновлении профиля");
            return StatusCode(500, new { message = "Произошла ошибка на сервере" });
        }
    }
}
