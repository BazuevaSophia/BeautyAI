using System.Collections.Generic;

namespace BeautyAI.Models
{
    public class UpdateProfileModel
    {
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
