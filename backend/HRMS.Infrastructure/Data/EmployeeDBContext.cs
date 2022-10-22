using HRMS.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace HRMS.Data
{
    // IdentityDbContext contains all the user tables
    public class EmployeeDBContext : DbContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public EmployeeDBContext(DbContextOptions<EmployeeDBContext> options, IHttpContextAccessor httpContextAccessor)
            : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<BasicInfo> BasicInfos { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Employee>(entity =>
            {
                entity.Property(e => e.EmployeeId).ValueGeneratedOnAdd();
            });

            builder.Entity<BasicInfo>(entity =>
            {
                entity.Property(e => e.BasicInfoId).ValueGeneratedOnAdd();
            });

            builder.Entity<Employee>()
            .HasOne(s => s.EmployeeBasicInfo)
            .WithOne(ad => ad.Employee)
            .HasForeignKey<BasicInfo>(ad => ad.EmployeeId);


            // builder.Entity<BasicInfo>()
            //.HasKey(s => s.EmployeeId);

            // modelBuilder.Entity<Employee>()
            //             .HasOne<EmployeeAddress>(p => p.EmployeeAddress)
            //             .WithOne(s => s.Employee);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var insertedEntries = this.ChangeTracker.Entries()
                                   .Where(x => x.State == EntityState.Added)
                                   .Select(x => x.Entity);

            var currentUsername = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "Anonymous";
           // var currentUsername =  _user ?? "Anonymous";

            foreach (var insertedEntry in insertedEntries)
            {
                var auditableEntity = insertedEntry as Auditable;
                //If the inserted object is an Auditable. 
                if (auditableEntity != null)
                {
                    auditableEntity.DateCreated = DateTimeOffset.UtcNow;
                    auditableEntity.UserCreated = currentUsername;
                }
            }

            var modifiedEntries = this.ChangeTracker.Entries()
                       .Where(x => x.State == EntityState.Modified)
                       .Select(x => x.Entity);

            foreach (var modifiedEntry in modifiedEntries)
            {
                //If the inserted object is an Auditable. 
                var auditableEntity = modifiedEntry as Auditable;
                if (auditableEntity != null)
                {
                    auditableEntity.DateModified = DateTimeOffset.UtcNow;
                    auditableEntity.UserModified = currentUsername;

                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
