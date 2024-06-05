using System;
using System.ComponentModel.DataAnnotations;

namespace BeautyAI.Models
{
    public class BookingResponseDTO
    {
        public int BookingId { get; set; }
        public string ServiceName { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public string ArtistName { get; set; }
        public string Duration { get; set; }
        public decimal Price { get; set; }
        public int ArtistId { get; set; } 
        public int ServiceId { get; set; } 
    }

}
