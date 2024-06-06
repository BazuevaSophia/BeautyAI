using System.Collections.Generic;

namespace BeautyAI.Models
{
    public class All_review
    {
        public int ReviewId2 { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } 
        public string Comment { get; set; }
        public List<string> Photo { get; set; } = new List<string>(); 
    }
}
