using BeautyAI.Data;
using BeautyAI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly BeautyAIDbContext _context;
    private readonly ILogger<BookingsController> _logger;

    public BookingsController(BeautyAIDbContext context, ILogger<BookingsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> CreateBooking([FromBody] BookingDTO bookingDTO)
    {
        if (!ModelState.IsValid)
        {
            _logger.LogError("Invalid model state.");
            return BadRequest(ModelState);
        }

        var existingBooking = await _context.Bookings
            .FirstOrDefaultAsync(b => b.UserId == bookingDTO.UserId && b.ServiceId == bookingDTO.ServiceId && b.Date == bookingDTO.Date && b.Time == bookingDTO.Time && b.Status == "оформлен");

        if (existingBooking != null)
        {
            return BadRequest(new { message = "Вы уже записаны на эту услугу на указанную дату и время." });
        }

        var booking = new Booking
        {
            UserId = bookingDTO.UserId,
            ArtistId = bookingDTO.ArtistId,
            ServiceId = bookingDTO.ServiceId,
            SignUpId = bookingDTO.SignUpId,
            Date = bookingDTO.Date,
            Time = bookingDTO.Time,
            Status = bookingDTO.Status
        };

        booking.User = await _context.Users.FindAsync(booking.UserId);
        booking.Artist = await _context.Artists.FindAsync(booking.ArtistId);
        booking.Service = await _context.Services.FindAsync(booking.ServiceId);
        booking.SignUp = await _context.SignUps.FindAsync(booking.SignUpId);

        if (booking.User == null || booking.Artist == null || booking.Service == null || booking.SignUp == null)
        {
            _logger.LogError("One or more entities not found.");
            return BadRequest("One or more entities not found.");
        }

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();
        _logger.LogInformation($"Booking created successfully with ID: {booking.BookingId}");

        var response = new
        {
            booking.BookingId,
            ServiceName = booking.Service.Name,
            booking.Date,
            booking.Time
        };

        return Ok(response);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserBookings(int userId)
    {
        var bookings = await _context.Bookings
            .Include(b => b.Service)
            .Include(b => b.Artist)
            .Where(b => b.UserId == userId && b.Status == "оформлен")
            .Select(b => new BookingResponseDTO
            {
                BookingId = b.BookingId,
                ServiceName = b.Service.Name,
                Date = b.Date,
                Time = b.Time,
                ArtistName = b.Artist.Name,
                Duration = b.Service.Duration,
                Price = b.Service.Price,
                ArtistId = b.ArtistId,
                ServiceId = b.ServiceId
            })
            .ToListAsync();

        return Ok(bookings);
    }

    [HttpDelete("{bookingId}")]
    public async Task<IActionResult> DeleteBooking(int bookingId)
    {
        var booking = await _context.Bookings.FindAsync(bookingId);
        if (booking == null)
        {
            return NotFound();
        }

        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{bookingId}")]
    public async Task<IActionResult> UpdateBooking(int bookingId, [FromBody] BookingDTO bookingDTO)
    {
        _logger.LogInformation($"Received request to update booking with ID: {bookingId}");
        _logger.LogInformation($"Booking data: {JsonConvert.SerializeObject(bookingDTO)}");

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var booking = await _context.Bookings.FindAsync(bookingId);
        if (booking == null)
        {
            return NotFound();
        }

        booking.Date = bookingDTO.Date;
        booking.Time = bookingDTO.Time;
        booking.ServiceId = bookingDTO.ServiceId;

        _context.Bookings.Update(booking);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"Booking with ID: {bookingId} updated successfully");

        return NoContent();
    }

    [HttpGet("completed")]
    public async Task<IActionResult> GetCompletedBookings()
    {
        try
        {
            var bookings = await _context.Bookings
                .Where(b => b.Status == "выполнена")
                .Include(b => b.Service)
                .Include(b => b.Artist)
                .Select(b => new CompletedBookingDTO
                {
                    BookingId = b.BookingId,
                    Description = b.Service.Name,
                    Date = b.Date, 
                    Time = b.Time, 
                    Master = b.Artist.Name,
                    Duration = b.Service.Duration, 
                    Price = b.Service.Price.ToString() 
                })
                .ToListAsync();
            _logger.LogInformation($"Completed bookings: {JsonConvert.SerializeObject(bookings)}");

            return Ok(bookings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении завершенных бронирований");
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }
}
