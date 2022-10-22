using System;

namespace HRMS.API.AutoMappers
{
    public static class AutoMapperConfiguration
    {
        public static Type[] RegisteredProfiles() =>

             new[] {
                 typeof(UserMapperProfile),
                 typeof(RoleMapperProfile),
                 typeof(EmployeeMapperProfile),
             };
    }
}
