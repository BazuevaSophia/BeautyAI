using System;
using System.Collections.Generic;

namespace BeautyAI.Models
{
    public class ReviewDTO
    {
        public int ReviewId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int ArtistId { get; set; }
        public short Rating { get; set; }
        public string Comment { get; set; }
        public List<string> Photos { get; set; }
    }
}
