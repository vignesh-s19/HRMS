using AutoMapper;
using HRMS.API.Models;
using HRMS.Entities;
using HRMS.Interfaces;
using HRMS.Notification;
using HRMS.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System;
using System.Threading.Tasks;
using System.Web;

namespace HRMS.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ApiController
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ClientAppMetadata _clientAppMetadata;

        private readonly IEmailSender _emailSender;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;

        public AuthController(
          UserManager<ApplicationUser> userManager,
          SignInManager<ApplicationUser> signInManager,
          ClientAppMetadata clientAppMetadata,
          IEmailSender emailSender,
          IMapper mapper,
          ILogger logger
          )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _clientAppMetadata = clientAppMetadata;
            _emailSender = emailSender;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginInput model)
        {
            if (!ModelState.IsValid)
            {
                return ModelStateErrorResponseError();
            }

            var user = await _userManager.FindByNameAsync(model.Username);

            if(user == null)
            {
                return ModelStateErrorResponseError("Login", AccountOptions.InvalidCredentialsErrorMessage);
            }

            if (user.UserStatus != UserStatus.Active )
            {
                return ModelStateErrorResponseError("Login", AccountOptions.UserDeactivated);
            }

            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                AuthenticationProperties props = null;
                if (AccountOptions.AllowRememberLogin && model.RememberLogin)
                {
                    props = new AuthenticationProperties
                    {
                        IsPersistent = true,
                        ExpiresUtc = DateTimeOffset.UtcNow.Add(AccountOptions.RememberMeLoginDuration)
                    };
                };

                await _signInManager.SignInAsync(user, props);
                _logger.Information($"loggedIn successfully {user.UserName} {user.Id}");

                var userRoles = await _userManager.GetRolesAsync(user);

                var userDto = _mapper.Map<UserDto>(user);
                userDto.UserRoles = userRoles;

                return Ok(userDto);
            }

            _logger.Warning($"login failed: {model.Username}");

            return ModelStateErrorResponseError("Login", AccountOptions.InvalidCredentialsErrorMessage);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> LogOff()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        [HttpPost("confirmemail")]
        public async Task<ActionResult<IdentityResult>> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return ModelStateErrorResponseError("UserIdOrCode", "userid or code cannot be null or empty");
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.Warning($"user not found : {userId}");

                return NotFound($"user not found : {userId}");
            }

            var result = await _userManager.ConfirmEmailAsync(user, code);

            return result;
        }

        [HttpPost("ForgotPassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword(ForgotPassword model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
            {
                // Don't reveal that the user does not exist or is not confirmed
                return BadRequest();
            }

            string code = await _userManager.GeneratePasswordResetTokenAsync(user);

            string callbackUrl = $"{ _clientAppMetadata.ResetPasswordClientUrl}?userId={user.Id}&code={HttpUtility.UrlEncode(code)}";

            await _emailSender.SendEmailAsync(model.Email, "NPM Reset Password Link",
               $"Dear <b>{user.FullName}</b>,<br /><br />As part of the verification process to set a new password,  Please follow the link by clicking <a href=\"" + callbackUrl + "\">here</a><br /><br />Warm regards,<br />NPM");
            
            _logger.Information($"password reset email has been sent to email: {model.Email}");
            return Ok(new { message = "password reset email has been sent to email" });
        }

        [HttpPost("ResetPassword")]
        [AllowAnonymous]
        public async Task<ActionResult<IdentityResult>> ResetPassword(ResetPassword model)
        {
            if (!ModelState.IsValid)
            {
                return ModelStateErrorResponseError();
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return BadRequest();
            }

            var result = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);
            if (result.Succeeded)
            {
                _logger.Information($"Password has been reset successfully, email: {model.Email}");
            }
            else
            {
                _logger.Information($"Password reset failed, email: {model.Email}");
            }
            return result;
        }

        //[HttpGet("user/{userId}")]
        //public async Task<ActionResult<ApplicationUser>> GetUserAsync(string userId)
        //{
        //    ApplicationUser user = await FindUserByIdAsync(userId);

        //    if(user == null)
        //    {
        //        return NotFound();
        //    }          

        //    return user;
        //}

        [HttpGet("VerifyResetPasswordToken")]
        public async Task<IActionResult> VerifyResetPasswordToken(string userId, string code)
        {
            ApplicationUser user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return BadRequest($"User not found : {userId}");
            }

            bool isValid = await _userManager.VerifyUserTokenAsync(user, _userManager.Options.Tokens.PasswordResetTokenProvider, "ResetPassword", code);

            return Ok(new { isValid });
        }

        //private async Task<ApplicationUser> FindUserByIdAsync(string userId)
        //{
        //    ApplicationUser user = await _userManager.FindByIdAsync(userId);

        //    if(user == null)
        //    {
        //        return null;
        //    }

        //    IEnumerable<string> Roles = await _userManager.GetRolesAsync(user);

        //    user.Id = null;
        //    user.PasswordHash = null;
        //    user.SecurityStamp = null;
        //    user.ConcurrencyStamp = null;
        //    user.Role = Roles.FirstOrDefault();

        //    return user;
        //}
    }
}
