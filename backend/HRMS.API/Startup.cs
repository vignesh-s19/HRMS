using AutoMapper;
using HRMS.API.AutoMappers;
using HRMS.Data;
using HRMS.Entities;
using HRMS.Infrastructure.Repositories;
using HRMS.Interfaces;
using HRMS.Notification;
using HRMS.Services;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System;
using System.IO;

namespace HRMS.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApiVersioning(o =>
            {
                o.AssumeDefaultVersionWhenUnspecified = true;
                o.DefaultApiVersion = new Microsoft.AspNetCore.Mvc.ApiVersion(1, 0);
                o.ReportApiVersions = true;
                o.ApiVersionReader = ApiVersionReader.Combine(
                    new QueryStringApiVersionReader("api-version"),
                    new HeaderApiVersionReader("X-Version"),
                    new MediaTypeApiVersionReader("ver"));
            });

    //        services.AddVersionedApiExplorer(
    //options =>
    //{
    //    options.GroupNameFormat = "'v'VVV";
    //    options.SubstituteApiVersionInUrl = true;
    //});

            var appAssembly = typeof(AppDbContext).Assembly.GetName().Name;

            services.AddDbContext<AppDbContext>(config => {
                config.UseSqlite(Configuration.GetConnectionString("SSOConnection"));
            });

            var assemblys = typeof(EmployeeDBContext).Assembly.GetName().Name;

            services.AddDbContext<EmployeeDBContext>(config => {
                config.UseSqlite(Configuration.GetConnectionString("APPDBConnection"));
            });

            // AddIdentity registers the services
            services.AddIdentity<ApplicationUser, ApplicationRole>(config =>
            {
                config.Password.RequiredLength = 4;
                config.Password.RequireDigit = false;
                config.Password.RequireNonAlphanumeric = false;
                config.Password.RequireUppercase = false;
            })
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();

            services.ConfigureApplicationCookie(config =>
            {
                config.Cookie.Name = "IdentityServer.Cookie";
                config.LoginPath = "/Account/Login";
                config.LogoutPath = "/Account/Logout";
            });

            services.AddIdentityServer()
                .AddConfigurationStore(options =>
                {
                    options.ConfigureDbContext = b => b.UseSqlite(Configuration.GetConnectionString("SSOConnection"),
                        sql => sql.MigrationsAssembly(appAssembly));
                })
                .AddOperationalStore(options =>
                {
                    options.ConfigureDbContext = b => b.UseSqlite(Configuration.GetConnectionString("SSOConnection"),
                        sql => sql.MigrationsAssembly(appAssembly));
                })
                .AddDeveloperSigningCredential() //not something we want to use in a production environment

                .AddInMemoryIdentityResources(InMemoryConfig.GetIdentityResources())
                .AddInMemoryApiResources(InMemoryConfig.GetApiResources())
                .AddInMemoryClients(InMemoryConfig.GetClients(Configuration))
                .AddAspNetIdentity<ApplicationUser>();

            var notificationMetadata = Configuration.GetSection("NotificationMetadata").Get<NotificationMetadata>();
            var clientAppMetadata = Configuration.GetSection("ClientAppMetadata").Get<ClientAppMetadata>();

            if (notificationMetadata == null)
            {
                throw new ArgumentNullException("NotificationMetadata");
            }

            if (clientAppMetadata == null)
            {
                throw new ArgumentNullException("ClientAppMetadata");
            }

            Log.Logger = new LoggerConfiguration()
              .WriteTo.File(Path.Combine("D:\\HRMS\\Logs\\", "Test-Log-{Date}.txt"),
              rollingInterval: RollingInterval.Day, fileSizeLimitBytes: 100000)
              .CreateLogger();


            services.AddSingleton(Log.Logger);

            services.AddSingleton(notificationMetadata);
            services.AddSingleton(clientAppMetadata);

            services.AddTransient<IEmployeeRepository, EmployeeRepository>();
            services.AddTransient<IUserProfileRepository, UserProfileRepository>();
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<IProfileService, IdentityClaimsProfileService>();
            services.AddTransient<IEmailSender, AuthMessageSender>();

            services.AddAutoMapper(AutoMapperConfiguration.RegisteredProfiles());

            services.AddControllers();

            services.AddAuthentication("Bearer").AddJwtBearer("Bearer", options =>
            {
                options.Authority = "https://localhost:5001";
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = false,
                };
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseIdentityServer();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
