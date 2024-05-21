using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyAI.Migrations
{
    public partial class RemovePhotoColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Photo",
                table: "portfolio");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Photo",
                table: "portfolio",
                type: "text",
                nullable: false,
                defaultValue: string.Empty);
        }
    }

}
