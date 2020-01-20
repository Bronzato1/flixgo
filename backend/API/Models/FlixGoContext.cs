using Microsoft.EntityFrameworkCore;

namespace API.Models
{
    public class FlixGoContext : DbContext
    {
        public FlixGoContext(DbContextOptions<FlixGoContext> options) : base(options)
        { }

        public DbSet<PostItem> PostItems { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Author> Authors { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
 