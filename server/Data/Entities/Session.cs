using server.Auth.Model;
using System.ComponentModel.DataAnnotations;

namespace server.Data.Entities
{
    public class Session
    {
        public Guid Id { get; set; }

        public string LastRefreshToken { get; set; }

        public DateTimeOffset InitiatedAt { get; set; }

        public DateTimeOffset ExpiredAt { get; set; }

        public bool IsRevoked { get; set; }

        [Required]
        public required string UserId { get; set; }

        public ForumUser User { get; set; }
    }
}
