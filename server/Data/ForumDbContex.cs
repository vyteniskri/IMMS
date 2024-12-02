using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using server.Auth.Model;
using server.Data.Entities;

namespace server.Data
{
    public class ForumDbContex : IdentityDbContext<ForumUser>
    {
        private readonly IConfiguration _configuration;
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Task0> Tasks { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Session> Sessions { get; set; }

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
