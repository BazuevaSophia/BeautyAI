using System;
using System.ComponentModel.DataAnnotations;

namespace BeautyAI.Models
{
    public class MyBookingDTO
    {
        public int BookingId { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public string UserName { get; set; }
        public string ServiceName { get; set; }
    }
}
