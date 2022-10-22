using HRMS.Data;
using HRMS.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HRMS.Infrastructure.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly EmployeeDBContext _context;

        public EmployeeRepository(EmployeeDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Employee>> GetAllAsync(int skip = 0, int take = 1000)
        {
            return await _context.Employees
                .Include(s => s.EmployeeBasicInfo)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<Employee> GetByIdAsync(string id)
        {
            return await _context.Employees
                .Include(s => s.EmployeeBasicInfo.Employee)
                .FirstOrDefaultAsync(emp => emp.EmployeeId == id);
        }

        public async Task AddAsync(Employee employee)
        {
            employee.EmployeeId = null;
            
            if(employee.EmployeeBasicInfo != null)
            {
                employee.EmployeeBasicInfo.BasicInfoId = null;
            }

            await ValidateEmployee(employee);
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();
        }

        private async Task ValidateEmployee(Employee employee)
        {
            if (!string.IsNullOrWhiteSpace(employee.EmployeeCode))
            {
                var exists = await DoesEmployeeCodeExistsAsync(employee);

                if (exists)
                {
                    throw new ArgumentException($"{employee.EmployeeCode} already exsist", nameof(employee.EmployeeCode));
                }
            }
        }

        public async Task UpdateAsync(Employee employee)
        {
            await ValidateEmployee(employee);

            _context.Employees.Attach(employee);
            _context.Entry(employee).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(string id)
        {
            Employee existing = await GetByIdAsync(id);

            if (existing.EmployeeBasicInfo != null)
            {
                _context.BasicInfos.Remove(existing.EmployeeBasicInfo);
            }
            _context.Employees.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<bool> DoesEmployeeCodeExistsAsync(Employee employee)
        {

            return await _context.Employees
                .Where(s=> s.EmployeeId !=  employee.EmployeeId)
                .AnyAsync(s => 
                employee.EmployeeId != s.EmployeeId && 
                employee.EmployeeCode.ToLower().Equals(s.EmployeeCode.ToLower()));
        }

    }
}
