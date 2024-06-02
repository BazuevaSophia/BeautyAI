using System;
using System.Collections.Generic;

namespace BeautyAI.Models
{
    public class Review
    {
        public int ReviewId { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int ArtistId { get; set; }
        public Artist Artist { get; set; } = null!;
        public short Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public List<string>? Photo { get; set; } 

        public Review()
        {
        }
    }
}
