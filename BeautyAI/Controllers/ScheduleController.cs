using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using BeautyAI.Data;
using BeautyAI.Models;
using System.Linq;
using System;

namespace BeautyAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduleController : ControllerBase
    {
        private readonly BeautyAIDbContext _context;

        public ScheduleController(BeautyAIDbContext context)
        {
            _context = context;
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveSchedule([FromBody] ScheduleRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.DayOfWeek) || request.Times == null || request.Times.Length == 0)
            {
                return BadRequest(new { message = "Invalid request data" });
            }

            var artistId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(artistId, out int artistIdInt))
            {
                return BadRequest(new { message = "Invalid artist ID" });
            }

            var artist = await _context.Artists.FindAsync(artistIdInt);
            if (artist == null)
            {
                return NotFound(new { message = "Artist not found" });
            }

            var existingSignUp = await _context.SignUps
                .FirstOrDefaultAsync(s => s.DayOfWeek == request.DayOfWeek && s.ArtistId == artistIdInt);

            if (existingSignUp != null)
            {
                var existingTimes = existingSignUp.Times.ToList();
                var newTimes = request.Times.Except(existingTimes).ToList();
                existingSignUp.Times = existingTimes.Concat(newTimes).ToArray();
            }
            else
            {
                var signUp = new SignUp
                {
                    DayOfWeek = request.DayOfWeek,
                    Times = request.Times,
                    ArtistId = artistIdInt
                };
                _context.SignUps.Add(signUp);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Schedule saved successfully" });
        }


        [HttpGet("confirmed")]
        public async Task<IActionResult> GetConfirmedTimes()
        {
            var confirmedTimes = await _context.SignUps
                .Include(s => s.Artist)
                .ToListAsync();

            var result = confirmedTimes
                .GroupBy(s => s.DayOfWeek)
                .ToDictionary(
                    g => g.Key,
                    g => g.SelectMany(s => s.Times).Distinct().ToArray()
                );

            return Ok(result);
        }

        [HttpDelete("clearOldSignUps")]
        public async Task<IActionResult> ClearOldSignUps()
        {
            var lastWeek = DateTime.Today.AddDays(-7);
            var oldSignUps = await _context.SignUps.ToListAsync();
            var oldSignUpsToRemove = oldSignUps.Where(s => DateTime.Parse(s.DayOfWeek) < lastWeek).ToList();

            if (oldSignUpsToRemove.Any())
            {
                _context.SignUps.RemoveRange(oldSignUpsToRemove);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Old sign-ups cleared successfully" });
        }
    }

    public class ScheduleRequest
    {
        public string DayOfWeek { get; set; } = string.Empty;
        public string[] Times { get; set; } = new string[] { };
    }
}
