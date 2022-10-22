using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HRMS.Infrastructure.Migrations.EmployeeDB
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    EmployeeId = table.Column<string>(nullable: false),
                    EmployeeCode = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.EmployeeId);
                });

            migrationBuilder.CreateTable(
                name: "BasicInfos",
                columns: table => new
                {
                    BasicInfoId = table.Column<string>(nullable: false),
                    FirstName = table.Column<string>(nullable: true),
                    MiddleName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    AdharName = table.Column<string>(nullable: true),
                    GaurdianType = table.Column<int>(nullable: false),
                    GuardianName = table.Column<string>(nullable: true),
                    Nationality = table.Column<string>(nullable: true),
                    PAN = table.Column<string>(nullable: true),
                    DOB = table.Column<DateTime>(nullable: false),
                    MaritalStatus = table.Column<bool>(nullable: false),
                    Dependents = table.Column<string>(nullable: true),
                    Nominee = table.Column<string>(nullable: true),
                    EmployeeId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BasicInfos", x => x.BasicInfoId);
                    table.ForeignKey(
                        name: "FK_BasicInfos_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BasicInfos_EmployeeId",
                table: "BasicInfos",
                column: "EmployeeId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BasicInfos");

            migrationBuilder.DropTable(
                name: "Employees");
        }
    }
}
