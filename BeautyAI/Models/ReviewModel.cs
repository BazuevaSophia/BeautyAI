using System;
using System.Collections.Generic;

namespace BeautyAI.Models
{
    public class ReviewModel
    {
        public int UserId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public IFormFile? Photo { get; set; }
    }
}
