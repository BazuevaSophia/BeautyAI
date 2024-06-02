using System;
using System.ComponentModel.DataAnnotations;

namespace BeautyAI.Models
{
    public class BookingDTO
    {
        public int UserId { get; set; }
        public int ArtistId { get; set; }
        public int ServiceId { get; set; }
        public int SignUpId { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public string Status { get; set; }
    }

}
