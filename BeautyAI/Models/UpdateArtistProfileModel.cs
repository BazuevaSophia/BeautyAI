using System;
namespace BeautyAI.Models
{
    public class UpdateArtistProfileModel
    {
        public string? OldPassword { get; set; }
        public string? NewPassword { get; set; }
        public string? Phone { get; set; }
        public string? PersDescription { get; set; }
    }
}

