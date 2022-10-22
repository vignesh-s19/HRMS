using AutoMapper;
using HRMS.API.Models;
using HRMS.Entities;
using System.Linq;

namespace HRMS.API.AutoMappers
{
    public class UserMapperProfile : Profile
    {
        public UserMapperProfile()
        {
            CreateMap<Auditable, Auditable>()
                .ForMember(dest => dest.UserCreated, act => act.Ignore())
                .ForMember(dest => dest.UserModified, act => act.Ignore())
                .ForMember(dest => dest.DateCreated, act => act.Ignore())
                .ForMember(dest => dest.DateModified, act => act.Ignore());

            CreateMap<ApplicationUser, UserDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.UserRoles, opt => opt.MapFrom(src => src.UserRoles.Select(s => s.Role.Name)));

            CreateMap<UserProfile, UserProfileDto>();

            CreateMap<UserProfileDto, UserProfile>()
                .ReverseMap();
            CreateMap<UserProfile, UserProfile>()
              .ReverseMap();


            //UserBasicInfo
            CreateMap<UserBasicInfo, UserBasicInfoDto>()
                .ForMember(dest => dest.GaurdianType, opt => opt.MapFrom(src => src.GaurdianType.ToString()))
                .ReverseMap();

            CreateMap<UserBasicInfo, UserBasicInfo>()
                .IncludeBase<Auditable, Auditable>()
                .ReverseMap();

            //UserContactInfo
            CreateMap<UserContactInfo, UserContactInfoDto>()
               .ReverseMap();

            CreateMap<UserContactInfo, UserContactInfo>()
                .IncludeBase<Auditable, Auditable>()
                .ReverseMap();

        }
    }
}
