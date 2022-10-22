using AutoMapper;
using HRMS.API.Models;
using HRMS.Data;
using HRMS.Entities;

namespace HRMS.API.AutoMappers
{
    public class EmployeeMapperProfile : Profile
    {
        public EmployeeMapperProfile()
        {
            CreateMap<Employee, EmployeeDto>()
                .ReverseMap();

            CreateMap<BasicInfo, BasicInfoDto>()
                .ForMember(dest => dest.GaurdianType, opt => opt.MapFrom(src => src.GaurdianType.ToString()))
                .ReverseMap();

            CreateMap<Employee, Employee>().ReverseMap();
            CreateMap<BasicInfo, BasicInfo>()
              //  .ForMember(x => x.Employee, opt => opt.Condition(source => source.Employee != null))
                .ReverseMap();

        }
    }
}
