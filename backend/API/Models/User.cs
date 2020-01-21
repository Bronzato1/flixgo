using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public EnumStatus Status { get; set; }
        [Required]
        public EnumSubscription Subscription { get; set; }
        [Required]
        public EnumRights Rights { get; set; }
    }

    public enum EnumStatus {
        Approved,
        Banned,
        Deleted
    }

    public enum EnumSubscription {
        Basic,
        Premium,
        Cinematic
    }

    public enum EnumRights {
        User,
        Moderator,
        Admin
    }
}
