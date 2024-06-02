using Microsoft.AspNetCore.Mvc;
using BeautyAI.Data;
using BeautyAI.Models;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
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

        return Ok(new BookingDTO
        {
            UserId = booking.UserId,
            ArtistId = booking.ArtistId,
            ServiceId = booking.ServiceId,
            SignUpId = booking.SignUpId,
            Date = booking.Date,
            Time = booking.Time,
            Status = booking.Status
        });
    }
}
