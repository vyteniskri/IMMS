using Microsoft.EntityFrameworkCore;
using server.Data.Entities;

namespace server.Data
{
    public class ForumDbContex : DbContext
    {
        private readonly IConfiguration _configuration;
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Task0> Tasks { get; set; }
        public DbSet<Comment> Comments { get; set; }

        public ForumDbContex(IConfiguration configuration) 
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(_configuration.GetConnectionString(("PostgreSQL")));
        }
    }
}
