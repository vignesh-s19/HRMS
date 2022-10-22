using AutoMapper;
using HRMS.API.Filters;
using HRMS.API.Models;
using HRMS.Entities;
using HRMS.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.API.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/user/profile")]
   // [Authorize(Roles = Roles.Admin)]
    public class UserProfileV1Controller : ApiController
    {
        private readonly IUserProfileRepository _userProfileRepository;
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        public UserProfileV1Controller(
          IUserProfileRepository userProfileRepository,
            IMapper mapper,
            ILogger logger)
        {
            _userProfileRepository = userProfileRepository;
            _mapper = mapper;
            _logger = logger;
        }

        //GET: api/v1/user/profile
        [HttpGet] //https://codewithmukesh.com/blog/serilog-in-aspnet-core-3-1/
        [Activities("user profiles List")] // https://www.c-sharpcorner.com/forums/best-ways-to-track-user-activities-in-my-asp-net-core-app
        public async Task<ActionResult> GetAll()
        {
            var userProfiles = await _userProfileRepository.GetAllAsync();

            if (userProfiles == null)
            {
                _logger.Warning($"users unable to get all");

                return NotFound();
            }

            return Ok(_mapper.Map<IEnumerable<UserProfileDto>>(userProfiles));
        }

        //GET: api/v1/user/profile/id
        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(string id)
        {
            if (id == null)
            {
                return ModelStateErrorResponseError(nameof(id), $"{nameof(id)} cannot be null or empty");
            }

            var userProfile = await _userProfileRepository.GetByIdAsync(id);

            if (userProfile == null)
            {
                _logger.Warning($"Userprofile unable to find, id: {id}");
                return NotFound();
            }

            return Ok(_mapper.Map<UserProfileDto>(userProfile));
        }

        // POST: api/v1/user/profile
        [HttpPost]
        public async Task<ActionResult> SaveUserProfile([Bind("UserId")][FromBody] UserProfileDto model)
        {
            var userExists = await _userProfileRepository.UserExistsAsync(model.UserId);
            
            if (!userExists)
            {
                _logger.Warning($"User profile creation: UserId '{model.UserId}' not associated with user");

                return IdentityErrorResponseError("User Profile", $"UserId: '{model.UserId}' doesnot exists");
            }

            var exsists = await _userProfileRepository.ExistsAsync<UserProfile>(model.UserId);

            if(exsists)
            {
                _logger.Warning($"User profile creation: UserId '{model.UserId}' already exists");

                return IdentityErrorResponseError("User Profile", $"UserId: '{model.UserId}' already exists");
            }

            var profile = new UserProfile { UserId = model.UserId };

            await _userProfileRepository.AddAsync(profile);
            _logger.Information($"User profile has been created successfully, UserId: {profile.UserId}");

            return Ok(_mapper.Map<UserProfileDto>(profile));
        }

        // DELETE: api/v1/user/profile/id
        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveUserProfile(string id)
        {
            return await RemoveAction<UserProfile>(id);
        }

        // POST: api/v1/user/profile/contactInfo
        [HttpPost("contactInfo")]
        public async Task<ActionResult> SaveUserContactInfo([FromBody] UserContactInfoDto model)
        {
            return await SaveAction<UserContactInfo, UserContactInfoDto>(model);
        }

        // DELETE: api/v1/user/profile/contactInfo/id
        [HttpDelete("contactInfo/{id}")]
        public async Task<ActionResult> RemoveUserContactInfo(string id)
        {
            return await RemoveAction<UserContactInfo>(id);
        }


        // POST: api/v1/user/profile/basicInfo
        [HttpPost("basicInfo")]
        public async Task<ActionResult> SaveUserBasicInfo([FromBody] UserBasicInfoDto model)
        {
            return await SaveAction<UserBasicInfo, UserBasicInfoDto>(model);
        }

        // DELETE: api/v1/user/profile/id
        [HttpDelete("basicInfo/{id}")]
        public async Task<ActionResult> RemoveUserBasicInfo(string id)
        {
            return await RemoveAction<UserBasicInfo>(id);
        }


        #region private Actions

        private async Task<ActionResult> SaveAction<TEntity,TEntityDto>(TEntityDto model) where TEntity : IUserProfile, new() where TEntityDto : IUserProfileDto
        {
            var userProfile = await _userProfileRepository.ExistsAsync<UserProfile>(model.UserId);

            if (!userProfile)
            {
                var message = $"User profile unable to find, id: {model.UserId}";
                _logger.Warning(message);
                return NotFound(message);
            }

            var modelMappedEntity = _mapper.Map<TEntity>(model);
            var existsProfile = await _userProfileRepository.ExistsAsync<TEntity>(model.UserId);

            if (existsProfile)
            {
                var orgEntity = await _userProfileRepository.GetByIdAsync<TEntity>(model.UserId);

                var newEntity = _mapper.Map(modelMappedEntity, orgEntity);

                await _userProfileRepository.UpdateAsync(newEntity);

                _logger.Information($"{typeof(TEntity).Name} has been updated successfully, id: {modelMappedEntity.UserId}");

                return Ok(_mapper.Map<TEntityDto>(newEntity));

            }
            else
            {
                _logger.Information($"{typeof(TEntity).Name} has been {(existsProfile ? "updated" : "created") } successfully, id: {modelMappedEntity.UserId}");

                await _userProfileRepository.AddAsync(modelMappedEntity);

                return Ok(_mapper.Map<TEntityDto>(modelMappedEntity));
            }
        }

        private async Task<ActionResult> RemoveAction<T>(string id) where T : IUserProfile
        {
            if (id == null)
            {
                return ModelStateErrorResponseError(nameof(id), $"'{nameof(id)}' cannot be null or empty");
            }

            bool exists = await _userProfileRepository.ExistsAsync<T>(id);

            if (!exists)
            {
                var message = $"{typeof(T).Name} unable to find, id: '{id}'";
                _logger.Warning(message);
                return NotFound(message);
            }

            bool deleted = await _userProfileRepository.DeleteAsync<T>(id);
            if (deleted)
            {
                _logger.Information($"{ typeof(T).Name } has been deleted successfully, id: '{id}'");
            }
            else
            {
                _logger.Warning($"{typeof(T).Name} unable to delete, id: '{id}'");
            }

            return Ok(deleted);
        }

        #endregion
    }
}
