using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BeautyAI.Migrations
{
    public partial class UpdateBookingColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
           
            migrationBuilder.AlterColumn<string>(
                name: "Time",
                table: "booking",
                type: "text",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "interval");

           
            migrationBuilder.AlterColumn<string>(
                name: "Date",
                table: "booking",
                type: "text",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
          
            migrationBuilder.AlterColumn<TimeSpan>(
                name: "Time",
                table: "booking",
                type: "interval",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            
            migrationBuilder.AlterColumn<DateTime>(
                name: "Date",
                table: "booking",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
