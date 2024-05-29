using System;
using System.Collections.Generic;

namespace BeautyAI.Models
{
    public class UserFavoriteTrend
    {
        public int UserId { get; set; }
        public User User { get; set; }

        public int TrendId { get; set; }
        public Trend Trend { get; set; }
    }
}
