using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace API.Models
{
    public class PostItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        public string Image { get; set; } // path to image file
        public string Audio { get; set; } // path to audio file when Media is Audio
        
        public DateTime Creation { get; set; }
        public int ReadingTime { get; set; }
        public int CategoryId { get; set; }
        public int AuthorId { get; set; }
        public bool Favorite { get; set; }
        [Required]
        public EnumMedia Media { get; set; }
        public string YoutubeVideoId { get; set; }
        public string SpreakerEpisodeId { get; set; }

        public virtual Category Category { get; set; }
        public virtual Author Author { get; set; }
        public virtual List<Tag> Tags { get; set; }

        // FRENCH
        public string FrenchTitle { get; set; }
        public string FrenchContent { get; set; }

        // ENGLISH
        public string EnglishTitle { get; set; }
        public string EnglishContent { get; set; }
    }

    public enum EnumMedia
    {
        Text = 1,
        Audio = 2,
        Video = 3
    }
}
