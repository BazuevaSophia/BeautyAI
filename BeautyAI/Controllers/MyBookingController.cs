using BeautyAI.Data;
using BeautyAI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class MyBookingController : ControllerBase
{
    private readonly BeautyAIDbContext _context;
    private readonly ILogger<MyBookingController> _logger;

    public MyBookingController(BeautyAIDbContext context, ILogger<MyBookingController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetBookings()
    {
        try
        {
            var artistId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Service)
                .Where(b => b.ArtistId == artistId && b.Status == "оформлен")
                .Select(b => new MyBookingDTO
                {
                    BookingId = b.BookingId,
                    Date = b.Date,
                    Time = b.Time,
                    UserName = b.User.Name,
                    ServiceName = b.Service.Name 
                })
                .ToListAsync();

            return Ok(bookings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении бронирований");
            return StatusCode(500, new { message = "Произошла ошибка на сервере" });
        }
    }

    [HttpPost("complete/{bookingId}")]
    public async Task<IActionResult> CompleteBooking(int bookingId)
    {
        var booking = await _context.Bookings.FindAsync(bookingId);
        if (booking == null)
        {
            return NotFound(new { message = "Бронирование не найдено" });
        }

        booking.Status = "выполнена";
        _context.Bookings.Update(booking);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Статус бронирования обновлен" });
    }
}
