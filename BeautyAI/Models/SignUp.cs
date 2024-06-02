using System.Collections.Generic;

namespace BeautyAI.Models
{
    public class SignUp
    {
        public int SignUpId { get; set; }
        public string DayOfWeek { get; set; } = string.Empty;
        public string[] Times { get; set; } = new string[] { };
        public int ArtistId { get; set; }
        public Artist Artist { get; set; }
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
