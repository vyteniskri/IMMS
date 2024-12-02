namespace server.Auth.Model
{
    public class ForumRoles
    {
        public const string Admin = nameof(Admin);
        public const string Teacher = nameof(Teacher);
        public const string Student = nameof(Student);

        public static readonly IReadOnlyCollection<string> All = new[] { Admin, Teacher, Student };   
    }
}
