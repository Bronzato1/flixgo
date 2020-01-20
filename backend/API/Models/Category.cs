using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string FrenchName { get; set; }
        [Required]
        public string EnglishName { get; set; }
        [Required]
        public string Color { get; set; }
        [Required]
        public string ImageText { get; set; }
        public string ImageAudio { get; set; }
        public string ImageVideo { get; set; }
    }
}
