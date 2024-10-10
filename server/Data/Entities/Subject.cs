namespace server.Data.Entities
{
    public class Subject
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required DateTimeOffset CreatedAt { get; set; }

        public SubjectDto ToDto()
        {
            return new SubjectDto(Id, Title, Description, CreatedAt);
        }
    }
}
