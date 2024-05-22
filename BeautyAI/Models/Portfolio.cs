using System;
using System.Collections.Generic;

namespace BeautyAI.Models
{
    public class Portfolio
    {
        public int PortfolioId { get; set; }
        public ICollection<Artist> Artists { get; set; } = new List<Artist>(); 
        public List<string> Photo { get; set; } = new List<string>(); 
    }
}
