using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HRMS.Infrastructure.Migrations.EmployeeDB
{
    public partial class update_audiable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DateCreated",
                table: "Employees",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DateModified",
                table: "Employees",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserCreated",
                table: "Employees",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserModified",
                table: "Employees",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DateCreated",
                table: "BasicInfos",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DateModified",
                table: "BasicInfos",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserCreated",
                table: "BasicInfos",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserModified",
                table: "BasicInfos",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "DateModified",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "UserCreated",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "UserModified",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "BasicInfos");

            migrationBuilder.DropColumn(
                name: "DateModified",
                table: "BasicInfos");

            migrationBuilder.DropColumn(
                name: "UserCreated",
                table: "BasicInfos");

            migrationBuilder.DropColumn(
                name: "UserModified",
                table: "BasicInfos");
        }
    }
}
