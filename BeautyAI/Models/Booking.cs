using System;

namespace BeautyAI.Models
{
    public class Booking
    {
        public int BookingId { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = new User(); 
        public int ServiceId { get; set; }
        public Service Service { get; set; } = new Service(); 
        public int ArtistId { get; set; }
        public Artist Artist { get; set; } = new Artist(); 
        public DateTime Date { get; set; }
        public TimeSpan Time { get; set; }
        public string Status { get; set; } = string.Empty; 
    }
}
