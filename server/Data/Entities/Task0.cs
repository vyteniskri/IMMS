namespace server.Data.Entities
{
    public class Task0
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required DateTimeOffset CreatedAt { get; set; }

        public Subject Subject { get; set; }

        public TaskDto ToDto()
        {
            return new TaskDto(Id, Title, Description, CreatedAt);
        }
    }
}
