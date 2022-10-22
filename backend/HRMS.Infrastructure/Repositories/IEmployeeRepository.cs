using HRMS.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Infrastructure.Repositories
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<Employee>> GetAllAsync(int skip = 0, int take = 1000);
        Task<Employee> GetByIdAsync(string id);
        Task AddAsync(Employee employee);
        Task UpdateAsync(Employee employee);
        Task<bool> DeleteAsync(string id);
    }
}
