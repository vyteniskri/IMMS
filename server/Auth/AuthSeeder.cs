
using Microsoft.AspNetCore.Identity;
using server.Auth.Model;

namespace server.Auth
{
    public class AuthSeeder
    {
        public UserManager<ForumUser> _userManager { get; }
        public RoleManager<IdentityRole> _roleManager { get; }

        public AuthSeeder(UserManager<ForumUser> userManager, RoleManager<IdentityRole> roleManager) 
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }


        public async Task SeedAsync()
        {
            await AddDefaultRolesAsync();
            await AddAdminUserAsync();
            await AddTeacherUserAsync();
            await AddTeacherUserAsync2();
        }

        private async Task AddAdminUserAsync()
        {
            var newAdminUser = new ForumUser()
            {
                UserName = "Admin",
                Email = "admin@admin.com"
            };

            var exsistAdminUser = await _userManager.FindByNameAsync(newAdminUser.UserName);
            if (exsistAdminUser == null)
            {
                var createAdminUserResult = await _userManager.CreateAsync(newAdminUser, "Langai123!");
                if (createAdminUserResult.Succeeded)
                {
                    await _userManager.AddToRolesAsync(newAdminUser, ForumRoles.All);
                }
            }

        }

        private async Task AddTeacherUserAsync()
        {
            var newTeacherUser = new ForumUser()
            {
                UserName = "Teacher1",
                Email = "teacher@teacher.com"
            };

            var exsistAdminUser = await _userManager.FindByNameAsync(newTeacherUser.UserName);
            if (exsistAdminUser == null)
            {
                var createAdminUserResult = await _userManager.CreateAsync(newTeacherUser, "Langai123!");
                if (createAdminUserResult.Succeeded)
                {
                    await _userManager.AddToRoleAsync(newTeacherUser, ForumRoles.Teacher);
                }
            }

        }

        private async Task AddTeacherUserAsync2()
        {
            var newTeacherUser = new ForumUser()
            {
                UserName = "Teacher2",
                Email = "teacher@teacher.com"
            };

            var exsistAdminUser = await _userManager.FindByNameAsync(newTeacherUser.UserName);
            if (exsistAdminUser == null)
            {
                var createAdminUserResult = await _userManager.CreateAsync(newTeacherUser, "Langai123!");
                if (createAdminUserResult.Succeeded)
                {
                    await _userManager.AddToRoleAsync(newTeacherUser, ForumRoles.Teacher);
                }
            }

        }

        private async Task AddDefaultRolesAsync()
        {
            foreach (var role in ForumRoles.All)
            {
                var roleExists = await _roleManager.RoleExistsAsync(role);
                if (!roleExists)
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }
}
