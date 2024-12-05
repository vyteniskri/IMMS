using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Data.Entities;
using FluentValidation;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Results;
using System.ComponentModel.DataAnnotations;
using SharpGrip.FluentValidation.AutoValidation.Shared.Extensions;
using server;
using Microsoft.AspNetCore.Builder;
using System.ComponentModel.Design;
using server.Auth.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using server.Auth;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000").AllowCredentials().AllowAnyHeader().AllowAnyMethod(); ///AllowCredentials() added
    });
});

builder.Services.AddDbContext<ForumDbContex>();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation(configuration =>
{
    configuration.OverrideDefaultResultFactoryWith<ProblemDetailsResultFactory>();
});

builder.Services.AddTransient<JwtTokenService>();
builder.Services.AddTransient<SessionService>();
builder.Services.AddScoped<AuthSeeder>();

builder.Services.AddIdentity<ForumUser, IdentityRole>()
    .AddEntityFrameworkStores<ForumDbContex>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.MapInboundClaims = false;
    options.TokenValidationParameters.ValidAudience = builder.Configuration["Jwt:ValidAudience"];
    options.TokenValidationParameters.ValidIssuer = builder.Configuration["Jwt:ValidIssuer"];
    options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]));

});

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors();

using var scope = app.Services.CreateScope();

var dbContext = scope.ServiceProvider.GetRequiredService<ForumDbContex>();
dbContext.Database.Migrate();

var dbSeeder = scope.ServiceProvider.GetRequiredService<AuthSeeder>();
await dbSeeder.SeedAsync();
/*
  /api/subjects GET List 200
  /api/subjects POST Create 201
  /api/subjects/{id} GET One 200
  /api/subjects/{id} PUT/PATCH Modify 200
  /api/subjects/{id} DELETE Remove 200/204
 */

app.AddAuthApi();
app.AddSubjectApi();
app.AddTaskApi();
app.AddCommentApi();

app.UseAuthentication();
app.UseAuthorization();
app.Run();



//Comment
public record CommentDto(int Id, string Text, DateTimeOffset CreatedOn);
public record CreateCommentDto(string Text)
{
    public class CreateCommentDtoValidator : AbstractValidator<CreateCommentDto>
    {
        public CreateCommentDtoValidator()
        {
            RuleFor(x => x.Text).NotEmpty().Length(min: 5, max: 500);
        }
    }
};
public record UpdateCommentDto(string Text)
{
    public class UpdateCommentDtoValidator : AbstractValidator<UpdateCommentDto>
    {
        public UpdateCommentDtoValidator()
        {
            RuleFor(x => x.Text).NotEmpty().Length(min: 5, max: 500);
        }
    }
};



//Task
public record TaskDto(int Id, string Title, string Description, DateTimeOffset CreatedOn);
public record CreateTaskDto(string Title, string Description)
{
    public class CreateTaskDtoValidator : AbstractValidator<CreateTaskDto>
    {
        public CreateTaskDtoValidator()
        {
            RuleFor(x => x.Title).NotEmpty().Length(min: 2, max: 100);
            RuleFor(x => x.Description).NotEmpty().Length(min: 5, max: 500);
        }
    }
};
public record UpdateTaskDto(string Description)
{
    public class UpdateTaskDtoValidator : AbstractValidator<UpdateTaskDto>
    {
        public UpdateTaskDtoValidator()
        {
            RuleFor(x => x.Description).NotEmpty().Length(min: 5, max: 500);
        }
    }
};



public class ProblemDetailsResultFactory : IFluentValidationAutoValidationResultFactory
{

    public IResult CreateResult(EndpointFilterInvocationContext context, FluentValidation.Results.ValidationResult validationResult)
    {
        var problemDetails = new HttpValidationProblemDetails(validationResult.ToValidationProblemErrors())
        {
            Type = "https://tools.ietf.org/html/rfc4918#section-11.2",
            Title = "Unprocessable Entity",
            Status = 422
        };

        return Results.Problem(problemDetails);
    }
}



//Subject
public record SubjectDto(int Id, string Title, string Description, DateTimeOffset CreatedOn);
public record CreateSubjectDto(string Title, string Description)
{
    public class CreateSubjectDtoValidator : AbstractValidator<CreateSubjectDto>
    {
        public CreateSubjectDtoValidator()
        {
            RuleFor(x => x.Title).NotEmpty().Length(min:2, max:100);
            RuleFor(x => x.Description).NotEmpty().Length(min: 5, max: 500);
        }
    }
};
public record UpdateSubjectDto(string Description)
{
    public class UpdateSubjectDtoValidator : AbstractValidator<UpdateSubjectDto>
    {
        public UpdateSubjectDtoValidator()
        {
            RuleFor(x => x.Description).NotEmpty().Length(min: 5, max: 500);
        }
    }
};