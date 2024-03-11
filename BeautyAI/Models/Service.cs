using System;
using System.Collections.Generic;

namespace BeautyAI.Models
{
    public class Service
    {
        public int ServiceId { get; set; }
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int ArtistId { get; set; }
        public Artist Artist { get; set; } = null!; 
        public string Duration { get; set; } = string.Empty;
        public List<string> Photo { get; set; } = new List<string>();

        public Service()
        {
           
        }
    }
}
