using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BeautyAI.Migrations
{
    public partial class AddSignUpToBooking : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            
            migrationBuilder.CreateTable(
                name: "SignUp",
                columns: table => new
                {
                    SignUpId = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", Npgsql.EntityFrameworkCore.PostgreSQL.Metadata.NpgsqlValueGenerationStrategy.SerialColumn),
                    DayOfWeek = table.Column<string>(nullable: false),
                    Times = table.Column<string[]>(nullable: false),
                    ArtistId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SignUp", x => x.SignUpId);
                    table.ForeignKey(
                        name: "FK_SignUp_artist_ArtistId",
                        column: x => x.ArtistId,
                        principalTable: "artist",
                        principalColumn: "ArtistId",
                        onDelete: ReferentialAction.Cascade);
                });

           
            migrationBuilder.AddColumn<int>(
                name: "SignUpId",
                table: "booking",
                nullable: false,
                defaultValue: 0);

           
            migrationBuilder.CreateIndex(
                name: "IX_booking_SignUpId",
                table: "booking",
                column: "SignUpId");

          
            migrationBuilder.AddForeignKey(
                name: "FK_booking_SignUp_SignUpId",
                table: "booking",
                column: "SignUpId",
                principalTable: "SignUp",
                principalColumn: "SignUpId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            
            migrationBuilder.DropForeignKey(
                name: "FK_booking_SignUp_SignUpId",
                table: "booking");

            migrationBuilder.DropIndex(
                name: "IX_booking_SignUpId",
                table: "booking");

            
            migrationBuilder.DropColumn(
                name: "SignUpId",
                table: "booking");

          
            migrationBuilder.DropTable(
                name: "SignUp");
        }
    }
}
