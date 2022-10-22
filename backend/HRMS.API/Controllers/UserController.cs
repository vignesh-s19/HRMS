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
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Roles.Admin)]
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
            if(user == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<UserDto>(user));
        }

        //POST:api/user/invite
        [HttpPost("invite")]
        public async Task<ActionResult> Invite(/*to protect overpost enabled property binding*/
            [Bind("Email,UserRoles,RequestProfile")][FromBody] UserDto model)
        {
            var applicationUser = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
            };

            if(model.RequestProfile)
            {
                applicationUser.ProfileStatus = ProfileStatus.Pending;
            }

            var orgUser  = await _userManager.FindByEmailAsync(model.Email);

            if(orgUser != null)
            {
               return IdentityErrorResponseError("UserEmail", $"'{model.Email}' has already exists!");
            }

            foreach (var role in model.UserRoles)
            {
                bool roleExist = await _roleManager.RoleExistsAsync(role);

                if (!roleExist)
                {
                    _logger.Warning($"User Creation: Role {role} does not exist");

                    return IdentityErrorResponseError("UserCreation", $"Role {role} does not exist");
                }
            }

            IdentityResult createUserResult = await _userManager.CreateAsync(applicationUser);

            if (!createUserResult.Succeeded)
            {
                string message = string.Join(",", createUserResult.Errors.Select(s => s.Description));
                _logger.Warning($"Create user failed, Email:{model.Email}, Errors:{ message }");
                return IdentityErrorResponseError(createUserResult.Errors);
            }

            _logger.Information($"Created user successfully, Email:{model.Email}");

            IdentityResult addRoleResult = await _userManager.AddToRolesAsync(applicationUser, model.UserRoles);

            if (!addRoleResult.Succeeded)
            {
                string message = string.Join(",", addRoleResult.Errors.Select(s => s.Code + ": " + s.Description));
                _logger.Information($"Assigning role failed, Role:{string.Join(',', applicationUser.UserRoles)}, Errors:{ message }");

                return IdentityErrorResponseError(addRoleResult.Errors);
            }

            // Send an email with this link
            string code = await _userManager.GenerateEmailConfirmationTokenAsync(applicationUser);

            string callbackUrl = $"{ _clientAppMetadata.ConfirmEmailClientUrl}?userId={applicationUser.Id}&code={HttpUtility.UrlEncode(code)}";

            try
            {
                string currentDirectoryPath = AppDomain.CurrentDomain.BaseDirectory;

                var templatePath = PathHelper.Combine(currentDirectoryPath, "Notification/Mailtemplates/UserRegistration-min.html");

                var userRegistrationTemplate = System.IO.File.ReadAllText(templatePath)
                    .Replace("{{ACCOUNT-ACTIVATION-LINK}}", callbackUrl);
                
                var message = "Please confirm your Account by clicking this link: <a href=\"" + callbackUrl + "\">link</a>";

                await _emailSender.SendEmailAsync(applicationUser.Email, "Confirm your Account", userRegistrationTemplate);

                _logger.Information($"User {applicationUser.Email} created a new account and sent activation link to mail.");

            }
            catch(System.Net.Sockets.SocketException se)
            {
                _logger.Warning($"User {applicationUser.Email} created a new account and unable to send activation link to mail. Exception {se}");
            }
            return Ok(_mapper.Map<UserDto>(applicationUser));
        }

        // PUT: api/user/5
        [HttpPut("{id}/updateroles")]
        public async Task<ActionResult> UpdateRoles(string id, [Bind("UserRoles")][FromBody] UserDto model)
        {
            if (id == null)
            {
                return ModelStateErrorResponseError(nameof(id), $"{nameof(id)} cannot be null or empty");
            }

            var userToUpdate = await GetUserByIdAsync(id);

            if (userToUpdate == null)
            {
                return NotFound();
            }

            var oldUserRoles = userToUpdate.UserRoles.Select(s => s.Role.Name);

            var areTheyEqual = oldUserRoles.ToList().SequenceEqual(model.UserRoles.ToList());

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
                var addRoleResult = await _userManager.AddToRolesAsync(userToUpdate, model.UserRoles);

                if (!addRoleResult.Succeeded)
                {
                    return IdentityErrorResponseError(addRoleResult.Errors);
                }
            }
            return Ok(true);
        }

        // PUT: api/user/5
        [HttpPut("{id}/activate")]
        public async Task<ActionResult> ActivateUser(string id)
        {
            if (id == null)
            {
                return ModelStateErrorResponseError(nameof(id), $"{nameof(id)} cannot be null or empty");
            }

            var userToUpdate = await GetUserByIdAsync(id);

            if (userToUpdate == null)
            {
                return NotFound();
            }
            userToUpdate.IsActive = true;

            var updateResult = await _userManager.UpdateAsync(userToUpdate);

            if(!updateResult.Succeeded)
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
            
            var removeRoleResult =  await _userManager.RemoveFromRolesAsync(user, roles);

            if(!removeRoleResult.Succeeded)
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

        private  async Task<ApplicationUser> GetUserByIdAsync(string id)
        {
            var user =await _userManager
              .Users
               .Include(u => u.UserRoles)
              .ThenInclude(ur => ur.Role)
              .FirstOrDefaultAsync(u=>u.Id == id);

            return user;
        }
    }
}
