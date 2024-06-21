using System.Collections.Generic;

namespace BeautyAI.Models
{
    public class ReviewInputModel
    {
        public int UserId { get; set; }
        public string Comment { get; set; }
        public IFormFile Photo { get; set; }
    }
}
