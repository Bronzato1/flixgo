using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class Tag
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string language { get; set; }
        public string Name { get; set; }
        public int PostItemId { get; set; }
        public virtual PostItem PostItem { get; set; }
    }
}