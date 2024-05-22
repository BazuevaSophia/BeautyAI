using System;
using System.Collections.Generic; 

namespace BeautyAI.Models
{
    public class Trend
    {
        public int TrendId { get; set; } 
        public string Name { get; set; } 
        public string Description { get; set; } 
        public string Season { get; set; } 
        public short? Year { get; set; } 
        public List<string> Photo { get; set; }
        public ICollection<User> Users { get; set; } = new List<User>();

        public Trend()
        {
           
            Name = string.Empty;
            Description = string.Empty;
            Season = string.Empty;
            Photo = new List<string>(); 
        }
    }
}

