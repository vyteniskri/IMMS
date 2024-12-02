using server.Data.Entities;
using server.Data;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using server.Auth.Model;
using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using System.Threading.Tasks;

namespace server
{
    public static class Endpoints
    {
        public static void AddSubjectApi(this WebApplication app)
        {
            var subjectsGroups = app.MapGroup("/api").AddFluentValidationAutoValidation();

            subjectsGroups.MapGet("/subjects", async (ForumDbContex dbContex) =>
            {
                return (await dbContex.Subjects.ToListAsync()).Select(subject => subject.ToDto());
            });

            subjectsGroups.MapGet("/subjects/{subjectId}", async (int subjectId, ForumDbContex dbContex) =>
            {
                var subject = await dbContex.Subjects.FindAsync(subjectId);
                if (subject == null)
                {
                    return Results.NotFound();
                }

                return Results.Ok(subject.ToDto());
            });

            subjectsGroups.MapPost("/subjects", [Authorize(Roles = ForumRoles.Teacher)] async (CreateSubjectDto dto, HttpContext httpContext, ForumDbContex dbContex) =>
            {
                var subject = new Subject { Title = dto.Title, Description = dto.Description, CreatedAt = DateTimeOffset.UtcNow, UserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) };
                dbContex.Subjects.Add(subject);

                await dbContex.SaveChangesAsync();

                return Results.Created($"api/subjects/{subject.Id}", subject.ToDto());
            });

            subjectsGroups.MapPut("/subjects/{subjectId}", [Authorize(Roles = ForumRoles.Teacher)] async (UpdateSubjectDto dto, int subjectId, ForumDbContex dbContex, HttpContext httpContext) =>
            {
                var subject = await dbContex.Subjects.FindAsync(subjectId);
                if (subject == null)
                {
                    return Results.NotFound();
                }

                if (!httpContext.User.IsInRole(ForumRoles.Admin) && httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != subject.UserId)
                {
                    return Results.Forbid();
                }

                subject.Description = dto.Description;
                dbContex.Subjects.Update(subject);
                await dbContex.SaveChangesAsync();

                return Results.Ok(subject.ToDto());

            });


            subjectsGroups.MapDelete("/subjects/{subjectId}", [Authorize(Roles = ForumRoles.Teacher)] async (int subjectId, ForumDbContex dbContex, HttpContext httpContext) =>
            {
                var subject = await dbContex.Subjects.FindAsync(subjectId);
                if (subject == null)
                {
                    return Results.NotFound();
                }

                if (!httpContext.User.IsInRole(ForumRoles.Admin) && httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != subject.UserId)
                {
                    return Results.Forbid();
                }

                dbContex.Subjects.Remove(subject);
                await dbContex.SaveChangesAsync();

                return Results.NoContent();
            });
        }

        public static void AddTaskApi(this WebApplication app)
        {
            var tasksGroup = app.MapGroup("/api/subjects/{subjectId}").AddFluentValidationAutoValidation();

            tasksGroup.MapGet("tasks", async (int subjectId, ForumDbContex dbContex) =>
            {
                var subject = await dbContex.Subjects.FindAsync(subjectId);
                if (subject == null)
                {
                    return Results.NotFound();
                }

                var tasks = await dbContex.Tasks
                                         .Where(t => t.Subject.Id == subjectId)
                                         .Select(task => task.ToDto())
                                         .ToListAsync();
                return Results.Ok(tasks);

            });
            tasksGroup.MapGet("/tasks/{taskId}", async (int subjectId, int taskId, ForumDbContex dbContex) =>
            {

                var task = await dbContex.Tasks.FirstOrDefaultAsync(t => t.Id == taskId && t.Subject.Id == subjectId);
                if (task == null)
                {
                    return Results.NotFound();
                }

                return Results.Ok(task.ToDto());

            });
            tasksGroup.MapPost("/tasks", [Authorize(Roles = ForumRoles.Teacher)] async (int subjectId, CreateTaskDto dto, HttpContext httpContext, ForumDbContex dbContex) =>
            {
                var subject = await dbContex.Subjects.FindAsync(subjectId);

                if (subject == null)
                {
                    return Results.NotFound();
                }

                var task = new Task0 { Title = dto.Title, Description = dto.Description, Subject = subject, CreatedAt = DateTimeOffset.UtcNow, UserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) };
                dbContex.Tasks.Add(task);

                await dbContex.SaveChangesAsync();

                return Results.Created($"api/subjects/{task.Subject.Id}/tasks/{task.Id}", task.ToDto());

            });
            tasksGroup.MapPut("/tasks/{taskId}", [Authorize(Roles = ForumRoles.Teacher)] async (int subjectId, int taskId, UpdateTaskDto dto, HttpContext httpContext, ForumDbContex dbContex) =>
            {

                var task = await dbContex.Tasks.FirstOrDefaultAsync(t => t.Id == taskId && t.Subject.Id == subjectId);
                if (task == null)
                {
                    return Results.NotFound();
                }

                if (!httpContext.User.IsInRole(ForumRoles.Admin) && httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != task.UserId)
                {
                    return Results.Forbid();
                }

                task.Description = dto.Description;
                dbContex.Tasks.Update(task);
                await dbContex.SaveChangesAsync();

                return Results.Ok(task.ToDto());

            });
            tasksGroup.MapDelete("/tasks/{taskId}", [Authorize(Roles = ForumRoles.Teacher)] async (int subjectId, int taskId, HttpContext httpContext, ForumDbContex dbContex) =>
            {
                var task = await dbContex.Tasks.FirstOrDefaultAsync(t => t.Id == taskId && t.Subject.Id == subjectId);
                if (task == null)
                {
                    return Results.NotFound();
                }

                if (!httpContext.User.IsInRole(ForumRoles.Admin) && httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != task.UserId)
                {
                    return Results.Forbid();
                }

                dbContex.Tasks.Remove(task);
                await dbContex.SaveChangesAsync();

                return Results.NoContent();

            });
        }

        public static void AddCommentApi(this WebApplication app)
        {
            var tasksGroup = app.MapGroup("/api/subjects/{subjectId}/tasks/{taskId}").AddFluentValidationAutoValidation();

            tasksGroup.MapGet("/comments", async (int subjectId, int taskId, ForumDbContex dbContex) =>
            {

                var task = await dbContex.Tasks.FirstOrDefaultAsync(t => t.Id == taskId && t.Subject.Id == subjectId);
                if (task == null)
                {
                    return Results.NotFound();
                }

                var comment = await dbContex.Comments
                                                    .Where(c => c.Task0.Id == taskId && c.Task0.Subject.Id == subjectId)
                                                    .Select(c => c.ToDto())
                                                    .ToListAsync();
                return Results.Ok(comment);
            });
            tasksGroup.MapGet("/comments/{commentId}", async (int subjectId, int taskId, int commentId, ForumDbContex dbContex) =>
            {
                var comment = await dbContex.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.Task0.Id == taskId && c.Task0.Subject.Id == subjectId);
                if (comment == null)
                {
                    return Results.NotFound();
                }

                return Results.Ok(comment.ToDto());
            });
            tasksGroup.MapPost("/comments", [Authorize] async (int subjectId, int taskId, CreateCommentDto dto, HttpContext httpContext, ForumDbContex dbContex) =>
            {
                var task = await dbContex.Tasks.FirstOrDefaultAsync(t => t.Id == taskId && t.Subject.Id == subjectId);

                if (task == null)
                {
                    return Results.NotFound();
                }

                var comment = new Comment { Text = dto.Text, Task0 = task, CreatedAt = DateTimeOffset.UtcNow, UserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) };

                dbContex.Comments.Add(comment);

                await dbContex.SaveChangesAsync();

                return Results.Created($"api/subjects/{subjectId}/tasks/{comment.Task0.Id}/comments/{comment.Id}", comment.ToDto());
            });
            tasksGroup.MapPut("/comments/{commentId}", [Authorize] async (int subjectId, int taskId, int commentId, UpdateCommentDto dto, HttpContext httpContext, ForumDbContex dbContex) =>
            {
                var comment = await dbContex.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.Task0.Id == taskId && c.Task0.Subject.Id == subjectId);
                if (comment == null)
                {
                    return Results.NotFound();
                }

                if (!httpContext.User.IsInRole(ForumRoles.Admin) && httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != comment.UserId)
                {
                    return Results.Forbid();
                }

                comment.Text = dto.Text;
                dbContex.Comments.Update(comment);
                await dbContex.SaveChangesAsync();

                return Results.Ok(comment.ToDto());
            });
            tasksGroup.MapDelete("/comments/{commentId}", [Authorize] async (int subjectId, int taskId, int commentId, HttpContext httpContext, ForumDbContex dbContex) =>
            {
                var comment = await dbContex.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.Task0.Id == taskId && c.Task0.Subject.Id == subjectId);
                if (comment == null)
                {
                    return Results.NotFound();
                }

                if (!httpContext.User.IsInRole(ForumRoles.Admin) && httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != comment.UserId)
                {
                    return Results.Forbid();
                }

                dbContex.Comments.Remove(comment);
                await dbContex.SaveChangesAsync();

                return Results.NoContent();
            });
        }
    }
}
