using System.Collections.Generic;

namespace BeautyAI.Models
{
    public class ServiceUpdateModel
    {
        public int ServiceId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Duration { get; set; }
    }
}
