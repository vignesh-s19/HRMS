// <auto-generated />
using System;
using HRMS.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace HRMS.Infrastructure.Migrations.EmployeeDB
{
    [DbContext(typeof(EmployeeDBContext))]
    [Migration("20221011121334_init")]
    partial class init
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.7");

            modelBuilder.Entity("HRMS.Data.BasicInfo", b =>
                {
                    b.Property<string>("BasicInfoId")
                        .HasColumnType("TEXT");

                    b.Property<string>("AdharName")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("DOB")
                        .HasColumnType("TEXT");

                    b.Property<string>("Dependents")
                        .HasColumnType("TEXT");

                    b.Property<string>("EmployeeId")
                        .HasColumnType("TEXT");

                    b.Property<string>("FirstName")
                        .HasColumnType("TEXT");

                    b.Property<int>("GaurdianType")
                        .HasColumnType("INTEGER");

                    b.Property<string>("GuardianName")
                        .HasColumnType("TEXT");

                    b.Property<string>("LastName")
                        .HasColumnType("TEXT");

                    b.Property<bool>("MaritalStatus")
                        .HasColumnType("INTEGER");

                    b.Property<string>("MiddleName")
                        .HasColumnType("TEXT");

                    b.Property<string>("Nationality")
                        .HasColumnType("TEXT");

                    b.Property<string>("Nominee")
                        .HasColumnType("TEXT");

                    b.Property<string>("PAN")
                        .HasColumnType("TEXT");

                    b.HasKey("BasicInfoId");

                    b.HasIndex("EmployeeId")
                        .IsUnique();

                    b.ToTable("BasicInfos");
                });

            modelBuilder.Entity("HRMS.Data.Employee", b =>
                {
                    b.Property<string>("EmployeeId")
                        .HasColumnType("TEXT");

                    b.Property<string>("EmployeeCode")
                        .HasColumnType("TEXT");

                    b.HasKey("EmployeeId");

                    b.ToTable("Employees");
                });

            modelBuilder.Entity("HRMS.Data.BasicInfo", b =>
                {
                    b.HasOne("HRMS.Data.Employee", "Employee")
                        .WithOne("EmployeeBasicInfo")
                        .HasForeignKey("HRMS.Data.BasicInfo", "EmployeeId");
                });
#pragma warning restore 612, 618
        }
    }
}
