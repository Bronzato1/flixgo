using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Migrations
{
    public partial class AddSubscriptionRightsOnUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Rights",
                table: "Users",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Subscription",
                table: "Users",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rights",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Subscription",
                table: "Users");
        }
    }
}
