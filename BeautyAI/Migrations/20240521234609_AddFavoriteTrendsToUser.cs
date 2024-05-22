using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyAI.Migrations
{
    public partial class AddFavoriteTrendsToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserFavoriteTrends",
                columns: table => new
                {
                    FavoriteTrendsTrendId = table.Column<int>(type: "integer", nullable: false),
                    UsersUserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFavoriteTrends", x => new { x.FavoriteTrendsTrendId, x.UsersUserId });
                    table.ForeignKey(
                        name: "FK_UserFavoriteTrends_trend_FavoriteTrendsTrendId",
                        column: x => x.FavoriteTrendsTrendId,
                        principalTable: "trend",
                        principalColumn: "TrendId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserFavoriteTrends_users_UsersUserId",
                        column: x => x.UsersUserId,
                        principalTable: "users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserFavoriteTrends_UsersUserId",
                table: "UserFavoriteTrends",
                column: "UsersUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserFavoriteTrends");
        }
    }
}
