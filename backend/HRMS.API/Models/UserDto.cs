using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HRMS.API.Models
{
    public class InviteUserDto
    {
        [Required]
        [EmailAddress]
        [MaxLength(254)]
        [Display(Name = "Email address")]
        public string Email { get; set; }

        [Required]
        public string UserRole { get; set; }

        [Required]
        public bool? RequestProfile { get; set; }
    }

    public class RegisterUserDto : InviteUserDto
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public string Code { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class UserDto :AuditableDto
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

        [Required]
        [MinLength(1)]
        public IEnumerable<string> UserRoles { get; set; }

        public string UserStatus { get; set; }
        public string FullName { get; set; }

        public string ProfileStatus { get; set; }
    }

    public class UserStatusInputDto
    {
        [Required]
        public string UserId { get; set; }
        
        [Required]
        public string Status { get; set; }        
    }
}