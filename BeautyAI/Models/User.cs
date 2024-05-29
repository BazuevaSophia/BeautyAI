using System;
using System.Collections.Generic;

namespace BeautyAI.Models
{
    public class User
    {
        public int UserId { get; set; }
        public ICollection<Booking> Bookings { get; set; } = new HashSet<Booking>();
        public ICollection<Review> Reviews { get; set; } = new HashSet<Review>();
        public ICollection<All_review> All_Reviews { get; set; } = new HashSet<All_review>();
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Photo { get; set; } = string.Empty;  
        public string Role { get; set; } = string.Empty;
        public ICollection<UserFavoriteTrend> FavoriteTrends { get; set; } = new List<UserFavoriteTrend>();

        public User()
        {
        }
    }
}
