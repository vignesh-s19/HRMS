using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HRMS.API.Models
{
    public class UserDto
    {
        public string UserId { get; set; }

        [Required]
        [StringLength(30, MinimumLength = 3)]
        [Display(Name = "Username")]
        public string UserName { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(254)]
        [Display(Name = "Email address")]
        public string Email { get; set; }        

        //public string Role { get; set; }

        [Required]
        [MinLength(1)]
        public IEnumerable<string> UserRoles { get; set; }

        public string AccountStatus { get; set; }
        public string UserProfileStatus { get; set; }
        public bool RequestProfile { get; set; }


    }
}