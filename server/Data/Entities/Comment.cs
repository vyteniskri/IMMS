namespace server.Data.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public required string Text { get; set; }
        public required DateTimeOffset CreatedAt { get; set; }

        public Task0 Task0 { get; set; }

        public CommentDto ToDto()
        {
            return new CommentDto(Id, Text, CreatedAt);
        }
    }
}
