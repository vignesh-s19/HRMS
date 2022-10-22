using AutoMapper;
using HRMS.API.Filters;
using HRMS.API.Models;
using HRMS.Entities;
using HRMS.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Serilog;

namespace HRMS.API.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/employee")]
   // [Authorize(Roles = Roles.Admin)]
    public class EmployeeV1Controller : ApiController
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        public EmployeeV1Controller(
          IEmployeeRepository employeeRepository,
            IMapper mapper,
            ILogger logger)
        {
            _employeeRepository = employeeRepository;
            _mapper = mapper;
            _logger = logger;
        }

        //GET: api/v1/employee
        [HttpGet] //https://codewithmukesh.com/blog/serilog-in-aspnet-core-3-1/
        [Activities("Employees List")] // https://www.c-sharpcorner.com/forums/best-ways-to-track-user-activities-in-my-asp-net-core-app
        public async Task<ActionResult> GetAll()
        {
            var employees = await _employeeRepository.GetAllAsync();
            if (employees == null)
            {
                _logger.Warning($"Employee unable to get all");

                return NotFound();
            }

            return Ok(_mapper.Map<IEnumerable<EmployeeDto>>(employees));
        }

        //GET: api/v1/employee/id
        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(string id)
        {
            if (id == null)
            {
                return ModelStateErrorResponseError(nameof(id), $"{nameof(id)} cannot be null or empty");
            }

            var employee = await _employeeRepository.GetByIdAsync(id);

            if (employee == null)
            {
                _logger.Warning($"Employee unable to find, id: {id}");
                return NotFound();
            }

            return Ok(_mapper.Map<EmployeeDto>(employee));
        }

        // POST: api/v1/employee
        [HttpPost]
        public async Task<ActionResult> Add(/*to protect overpost enabled property binding*/
            [Bind("EmployeeBasicInfo")][FromBody] EmployeeDto model)
        {
            var employee = _mapper.Map<Employee>(model);

            try
            {
                await _employeeRepository.AddAsync(employee);
                _logger.Information($"Employee has been created successfully, id: {employee.EmployeeId}");

                return Ok(_mapper.Map<EmployeeDto>(employee));
            }
            catch(ArgumentException ex)
            {
                _logger.Error(ex.ToString());
                return IdentityErrorResponseError(ex.ParamName,ex.Message);
            }
        }

        // PUT: api/v1/employee
        [HttpPut]
        public async Task<ActionResult> Update([Bind("EmployeeId","EmployeeBasicInfo")][FromBody] EmployeeDto model)
        {
            if (model.EmployeeId == null)
            {
                return ModelStateErrorResponseError(nameof(model.EmployeeId), $"{nameof(model.EmployeeId)} cannot be null or empty");
            }

            var orgEmployee = await _employeeRepository.GetByIdAsync(model.EmployeeId);

            if (orgEmployee == null)
            {
                _logger.Warning($"Employee unable to find, id: {model.EmployeeId}");

                return NotFound();
            }

            var empModel = _mapper.Map<Employee>(model);

            if (orgEmployee.EmployeeBasicInfo?.BasicInfoId != empModel.EmployeeBasicInfo?.BasicInfoId)
            {
                return ModelStateErrorResponseError(nameof(orgEmployee.EmployeeBasicInfo.BasicInfoId), $"{nameof(orgEmployee.EmployeeBasicInfo.BasicInfoId)} cannot be miss match");
            }

            if (orgEmployee.EmployeeBasicInfo?.Employee != null)
            {
                empModel.EmployeeBasicInfo.Employee = orgEmployee.EmployeeBasicInfo.Employee;
            }

            _mapper.Map(empModel, orgEmployee);

            await _employeeRepository.UpdateAsync(orgEmployee);

            _logger.Information($"Employee has been updated successfully, id: {orgEmployee.EmployeeId}");

            return Ok(_mapper.Map<EmployeeDto>(orgEmployee));
        }

        // DELETE: api/v1/employee/id
        [HttpDelete("{id}")]
        public async Task<ActionResult> Remove(string id)
        {
            if (id == null)
            {
                return ModelStateErrorResponseError(nameof(id), $"{nameof(id)} cannot be null or empty");
            }

            Employee employee = await _employeeRepository.GetByIdAsync(id);

            if (employee == null)
            {
                _logger.Warning($"Employee unable to find, id: {id}");
                return NotFound();
            }

            bool deleted = await _employeeRepository.DeleteAsync(id);
            if(deleted)
            {
                _logger.Information($"Employee has been deleted successfully, id: {id}");
            }
            else
            {
                _logger.Warning($"Employee unable to delete, id: {id}");
            }

            return Ok(deleted);
        }
    }
}
