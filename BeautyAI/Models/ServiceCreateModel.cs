using System.Collections.Generic;

namespace BeautyAI.Models
{
    public class ServiceCreateModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Duration { get; set; }
        public int ArtistId { get; set; }
        public IFormFile[] Photo { get; set; }
    }
}
