using System;
using System.ComponentModel.DataAnnotations;

namespace BeautyAI.Models
{
    public class CompletedBookingDTO
    {
        public int BookingId { get; set; }
        public string Description { get; set; }
        public string Date { get; set; }
        public string Master { get; set; }
        public string Duration { get; set; }
        public string Price { get; set; }
        public string Time { get; set; }  // Добавим это поле
    }

}
