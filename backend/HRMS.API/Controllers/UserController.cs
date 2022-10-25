using AutoMapper;
using HRMS.API.Models;
using HRMS.Entities;
using HRMS.Infrastructure.Constants;
using HRMS.Interfaces;
using HRMS.Notification;
using Serilog;
using HRMS.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace HRMS.API.Controllers
{
    // [Route("api/[controller]")]
    [ApiController]
    // [Authorize(Roles = Roles.Admin)]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/user")]
    public class UserController : ApiController
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly ClientAppMetadata _clientAppMetadata;

        private readonly IEmailSender _emailSender;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;
        public UserController(
          UserManager<ApplicationUser> userManager,
          RoleManager<ApplicationRole> roleManager,
          ClientAppMetadata clientAppMetadata,
          IEmailSender emailSender,
          ILogger logger,
          IMapper mapper
          )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _clientAppMetadata = clientAppMetadata;
            _emailSender = emailSender;
            _logger = logger;
            _mapper = mapper;
        }

        //GET:api/user
        [HttpGet]
        public ActionResult<IEnumerable<UserDto>> GetAll()
        {
            var users = _userManager
               .Users
               .Include(u => u.UserRoles)
               .ThenInclude(ur => ur.Role);

            if (users == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<IEnumerable<UserDto>>(users));
        }

        //GET:api/user/id
        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(string id)
        {
            if (id == null)
            {
                return ModelStateErrorResponseError(nameof(id), $"{nameof(id)} cannot be null or empty");
            }

            var user = await GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<UserDto>(user));
        }

        //GET:api/v1/user/emailexists
        [HttpGet("emailexists")]
        public async Task<ActionResult> EmailExists([FromQuery] string email)
        {
            if (email == null)
            {
                return ModelStateErrorResponseError(nameof(email), $"{nameof(email)} cannot be null or empty");
            }

            var user = await _userManager.FindByEmailAsync(email);
            return Ok(user != null);
        }


        //POST:api/user/invite
        [HttpPost("invite")]
        public async Task<ActionResult> Invite([Bind("Email, UserRole, RequestProfile")][FromBody] InviteUserDto model)
        {

            var orgUser = await _userManager.FindByEmailAsync(model.Email);

            if (orgUser != null)
            {
                return IdentityErrorResponseError("UserEmail", $"'{model.Email}' has already exists!");
            }

            bool roleExist = await _roleManager.RoleExistsAsync(model.UserRole);

            if (!roleExist)
            {
                _logger.Warning($"User Creation: Role {model.UserRole} does not exist");

                return IdentityErrorResponseError("UserCreation", $"Role {model.UserRole} does not exist");
            }


            var profileStatus = model.RequestProfile.HasValue ? ProfileStatus.Pending : ProfileStatus.None;

            var applicationUser = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                UserStatus = UserStatus.Invited,
                ProfileStatus = profileStatus
            };

            IdentityResult createUserResult = await _userManager.CreateAsync(applicationUser);

            if (!createUserResult.Succeeded)
            {
                string message = string.Join(",", createUserResult.Errors.Select(s => s.Description));
                _logger.Warning($"Create user failed, Email:{model.Email}, Errors:{ message }");
                return IdentityErrorResponseError(createUserResult.Errors);
            }

            _logger.Information($"Created user successfully, Email:{model.Email}");


            IdentityResult addRoleResult = await _userManager.AddToRoleAsync(applicationUser, model.UserRole);

            if (!addRoleResult.Succeeded)
            {
                string message = string.Join(",", addRoleResult.Errors.Select(s => s.Code + ": " + s.Description));
                _logger.Information($"Assigning role failed, Role:{string.Join(',', applicationUser.UserRoles)}, Errors:{ message }");

                return IdentityErrorResponseError(addRoleResult.Errors);
            }

            // Send an email with this link
            string code = await _userManager.GenerateEmailConfirmationTokenAsync(applicationUser);

            string callbackUrl = $"{ _clientAppMetadata.RegisterUserClientUrl}/{applicationUser.Id}/?code={HttpUtility.UrlEncode(code)}";

            try
            {
                string currentDirectoryPath = AppDomain.CurrentDomain.BaseDirectory;

                var templatePath = PathHelper.Combine(currentDirectoryPath, "Notification/Mailtemplates/UserInvitation-min.html");

                var userInvitationTemplate = System.IO.File.ReadAllText(templatePath)
                    .Replace("{{ACCOUNT-ACTIVATION-LINK}}", callbackUrl);

                //  var message = "Please confirm your Account by clicking this link: <a href=\"" + callbackUrl + "\">link</a>";

                await _emailSender.SendEmailAsync(applicationUser.Email, "User Invitation", userInvitationTemplate);

                _logger.Information($"User {applicationUser.Email} created a new account and sent link to registration link to activate.");

            }
            catch (System.Net.Sockets.SocketException se)
            {
                _logger.Warning($"User {applicationUser.Email} created a new account and unable to send registration link to mail. Exception {se}");
            }
            return Ok(_mapper.Map<UserDto>(applicationUser));
        }

        //POST:api/user/invite
        [HttpPost("register")]
        public async Task<ActionResult> Register([Bind("UserId, Code, RequestProfile")][FromBody] RegisterUserDto model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);

            if (user == null)
            {
                _logger.Warning($"user not found, userId:{model.UserId}");
                return NotFound($"user not found : {model.UserId}");
            }

            if (user.UserStatus != UserStatus.Invited)
            {
                var message = $"register email failed, Email:{model.Email} not invited , may be invitation revoked";
                _logger.Warning(message);
                return IdentityErrorResponseError("User register", message);
            }

            var confirmEmailResult = await _userManager.ConfirmEmailAsync(user, model.Code);

            if (!confirmEmailResult.Succeeded)
            {
                string message = string.Join(",", confirmEmailResult.Errors.Select(s => s.Description));
                _logger.Warning($"confirm email failed, Email:{model.Email}, Errors:{ message }");
                return IdentityErrorResponseError(confirmEmailResult.Errors);
            }

            var passwordResult = await _userManager.AddPasswordAsync(user, model.Password);
            if (!passwordResult.Succeeded)
            {
                string message = string.Join(",", passwordResult.Errors.Select(s => s.Description));
                _logger.Warning($"resgister user failed, Email:{model.Email}, Errors:{ message }");
                return IdentityErrorResponseError(passwordResult.Errors);
            }

            user.ProfileStatus = model.RequestProfile.HasValue ? ProfileStatus.Pending : ProfileStatus.None;
            user.UserStatus = UserStatus.Active;

            IdentityResult updateUserResult = await _userManager.UpdateAsync(user);

            if (!updateUserResult.Succeeded)
            {
                string message = string.Join(",", updateUserResult.Errors.Select(s => s.Description));
                _logger.Warning($"register user failed, Email:{model.Email}, Errors:{ message }");
                return IdentityErrorResponseError(updateUserResult.Errors);
            }

            _logger.Information($"registered user successfully, Email:{model.Email}");

            try
            {
                string currentDirectoryPath = AppDomain.CurrentDomain.BaseDirectory;

                var templatePath = PathHelper.Combine(currentDirectoryPath, "Notification/Mailtemplates/UserRegistration-min.html");

                //{{USER-PROFILE-LINK}}
                var userCofirmationTemplate = System.IO.File.ReadAllText(templatePath)

                    .Replace("{{USER-FULLNAME}}", user.FullName)
                    .Replace("{{USER-PROFILE-LINK}}", _clientAppMetadata.UserProfileClientUrl)
                    .Replace("{{PORTAL-NAME}}", "HRMStudio")
                    .Replace("{{CONTACT-EMAIL}}", "hrindia@quadgen");

                await _emailSender.SendEmailAsync(user.Email, "Account Confirmation", userCofirmationTemplate);

                _logger.Information($"User {user.Email} registered a account and sent confirmation mail.");
            }
            catch (System.Net.Sockets.SocketException se)
            {
                _logger.Warning($"User {user.Email} registered a account and unable to send confirmation mail. Exception {se}");
            }
            return Ok(_mapper.Map<UserDto>(user));
        }

        // PUT: api/user/5
        [HttpPut("{id}/update/roles")]
        public async Task<ActionResult> UpdateRoles(string id, [FromBody] string[] UserRoles)
        {
            if (id == null)
            {
                return ModelStateErrorResponseError(nameof(id), $"{nameof(id)} cannot be null or empty");
            }

            if (UserRoles == null)
            {
                return ModelStateErrorResponseError(nameof(UserRoles), $"{nameof(UserRoles)} cannot be null or empty");
            }

            var userToUpdate = await GetUserByIdAsync(id);

            if (userToUpdate == null)
            {
                return NotFound();
            }

            var oldUserRoles = userToUpdate.UserRoles.Select(s => s.Role.Name);

            var areTheyEqual = oldUserRoles.ToList().SequenceEqual(UserRoles);

            if (!areTheyEqual)
            {
                if (oldUserRoles.Any())
                {
                    var removeRoleResult = await _userManager.RemoveFromRolesAsync(userToUpdate, oldUserRoles);
                    if (!removeRoleResult.Succeeded)
                    {
                        return IdentityErrorResponseError(removeRoleResult.Errors);
                    }
                }
                var addRoleResult = await _userManager.AddToRolesAsync(userToUpdate, UserRoles);

                if (!addRoleResult.Succeeded)
                {
                    return IdentityErrorResponseError(addRoleResult.Errors);
                }
            }
            return Ok(true);
        }

        // PUT: api/user/update/status
        [HttpPut("update/status")]
        public async Task<ActionResult> UpdateUserstatus(UserStatusInputDto userStatus)
        {
            if (!Enum.TryParse<UserStatus>(userStatus.Status, out UserStatus status))
            {
                return ModelStateErrorResponseError(nameof(userStatus.Status), $"{nameof(userStatus.Status)} invalid user status");
            }

            var userToUpdate = await GetUserByIdAsync(userStatus.UserId);

            if (userToUpdate == null)
            {
                return NotFound();
            }
            userToUpdate.UserStatus = status;

            var updateResult = await _userManager.UpdateAsync(userToUpdate);

            if (!updateResult.Succeeded)
            {
                return IdentityErrorResponseError(updateResult.Errors);
            }

            return Ok(updateResult.Succeeded);
        }

        // DELETE: api/user/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Remove(string id)
        {
            if (id == null)
            {
                return ModelStateErrorResponseError(nameof(id), $"{nameof(id)} cannot be null or empty");
            }

            ApplicationUser user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            var roles = await _userManager.GetRolesAsync(user);

            var removeRoleResult = await _userManager.RemoveFromRolesAsync(user, roles);

            if (!removeRoleResult.Succeeded)
            {
                return IdentityErrorResponseError(removeRoleResult.Errors);
            }

            IdentityResult deleteUserResult = await _userManager.DeleteAsync(user);

            if (!deleteUserResult.Succeeded)
            {
                return IdentityErrorResponseError(deleteUserResult.Errors);
            }

            return Ok(deleteUserResult.Succeeded);
        }

        private async Task<ApplicationUser> GetUserByIdAsync(string id)
        {
            var user = await _userManager
              .Users
               .Include(u => u.UserRoles)
              .ThenInclude(ur => ur.Role)
              .FirstOrDefaultAsync(u => u.Id == id);

            return user;
        }
    }
}
