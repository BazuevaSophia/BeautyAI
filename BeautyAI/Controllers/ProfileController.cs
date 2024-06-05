using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BeautyAI.Data;
using BeautyAI.Models;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace BeautyAI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly BeautyAIDbContext _context;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(BeautyAIDbContext context, ILogger<ProfileController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("getProfile")]
    public async Task<IActionResult> GetProfile()
    {
        if (!User.Identity.IsAuthenticated)
        {
            return Unauthorized(new { message = "Пользователь не авторизован." });
        }

        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _context.Users
                                     .Where(u => u.UserId.ToString() == userId)
                                     .Select(u => new {
                                         u.UserId,
                                         u.Name,
                                         u.Email,
                                         u.Phone,
                                         u.Photo
                                     })
                                     .FirstOrDefaultAsync();
            if (user == null)
            {
                _logger.LogWarning("Профиль пользователя не найден.");
                return NotFound(new { message = "Профиль пользователя не найден." });
            }

            return Ok(user);
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
        if (!User.Identity.IsAuthenticated)
        {
            return Unauthorized(new { message = "Пользователь не авторизован." });
        }

        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userId, out int userIdInt))
            {
                _logger.LogWarning("Некорректный формат идентификатора пользователя.");
                return BadRequest(new { message = "Некорректный формат идентификатора пользователя." });
            }
            var user = await _context.Users.FindAsync(userIdInt);
            if (user == null)
            {
                _logger.LogWarning("Профиль пользователя не найден.");
                return NotFound(new { message = "Профиль пользователя не найден." });
            }

            user.Photo = photoModel.PhotoUrl;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { photo = user.Photo, message = "Фото обновлено успешно." });
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
        if (!User.Identity.IsAuthenticated)
        {
            return Unauthorized(new { message = "Пользователь не авторизован." });
        }

        if (photo == null || photo.Length == 0)
        {
            return BadRequest(new { message = "Фото не предоставлено." });
        }

        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userId, out int userIdInt))
            {
                _logger.LogWarning("Некорректный формат идентификатора пользователя.");
                return BadRequest(new { message = "Некорректный формат идентификатора пользователя." });
            }
            var user = await _context.Users.FindAsync(userIdInt);
            if (user == null)
            {
                _logger.LogWarning("Профиль пользователя не найден.");
                return NotFound(new { message = "Профиль пользователя не найден." });
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

                        user.Photo = imgurResponse.Data.Link;
                    }
                }
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Фото пользователя успешно обновлено");
            return Ok(new { photo = user.Photo });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при загрузке фото");
            return StatusCode(500, new { message = "Произошла ошибка на сервере" });
        }
    }

    [HttpPost("updateProfile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileModel model)
    {
        if (!User.Identity.IsAuthenticated)
        {
            return Unauthorized(new { message = "Пользователь не авторизован." });
        }

        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userId, out int userIdInt))
            {
                return BadRequest(new { message = "Некорректный формат идентификатора пользователя." });
            }

            var user = await _context.Users.FindAsync(userIdInt);
            if (user == null)
            {
                return NotFound(new { message = "Профиль пользователя не найден." });
            }

            if (!string.IsNullOrEmpty(model.OldPassword) && !string.IsNullOrEmpty(model.NewPassword))
            {
                if (user.Password != model.OldPassword)
                {
                    return BadRequest(new { message = "Старый пароль неверен." });
                }

                user.Password = model.NewPassword;
            }

            user.Email = model.Email;
            user.Phone = model.Phone;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { user.Email, user.Phone, message = "Данные профиля успешно обновлены." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при обновлении профиля");
            return StatusCode(500, new { message = "Произошла ошибка на сервере" });
        }
    }

}

public class PhotoModel
{
    public string PhotoUrl { get; set; } = string.Empty;
}

public class ImgurResponse
{
    public ImgurData Data { get; set; }
}

public class ImgurData
{
    public string Link { get; set; }
}
