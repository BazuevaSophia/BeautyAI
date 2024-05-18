using System;
using System.Collections.Generic;

namespace BeautyAI.Models
{
    public class Artist
    {
        public int ArtistId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Photo { get; set; } = string.Empty; // Изменено с List<string> на string
        public string PersDescription { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public int? PortfolioId { get; set; }
        public Portfolio? Portfolio { get; set; }
        public ICollection<Booking> Bookings { get; set; } = new HashSet<Booking>();
        public ICollection<Review> Reviews { get; set; } = new HashSet<Review>();
        public ICollection<Service> Services { get; set; } = new HashSet<Service>();
        public string Phone { get; set; } = string.Empty;
        public short Rating { get; set; }
    }
}

