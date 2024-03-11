using System.Collections.Generic;

namespace BeautyAI.Models
{
    public class All_review
    {
        public int ReviewId2 { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = new User();
        public short Rating { get; set; }
        public string Comment { get; set; } = string.Empty; 
        public List<string> Photo { get; set; } = new List<string>();

      
    }
}

