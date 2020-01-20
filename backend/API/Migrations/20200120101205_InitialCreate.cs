using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Authors",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: false),
                    Url = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Authors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FrenchName = table.Column<string>(nullable: false),
                    EnglishName = table.Column<string>(nullable: false),
                    Color = table.Column<string>(nullable: false),
                    ImageText = table.Column<string>(nullable: false),
                    ImageAudio = table.Column<string>(nullable: true),
                    ImageVideo = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PostItems",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Image = table.Column<string>(nullable: true),
                    Audio = table.Column<string>(nullable: true),
                    Creation = table.Column<DateTime>(nullable: false),
                    ReadingTime = table.Column<int>(nullable: false),
                    CategoryId = table.Column<int>(nullable: false),
                    AuthorId = table.Column<int>(nullable: false),
                    Favorite = table.Column<bool>(nullable: false),
                    Media = table.Column<int>(nullable: false),
                    YoutubeVideoId = table.Column<string>(nullable: true),
                    SpreakerEpisodeId = table.Column<string>(nullable: true),
                    FrenchTitle = table.Column<string>(nullable: true),
                    FrenchContent = table.Column<string>(nullable: true),
                    EnglishTitle = table.Column<string>(nullable: true),
                    EnglishContent = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PostItems_Authors_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Authors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostItems_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    language = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    PostItemId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tags_PostItems_PostItemId",
                        column: x => x.PostItemId,
                        principalTable: "PostItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PostItems_AuthorId",
                table: "PostItems",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_PostItems_CategoryId",
                table: "PostItems",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Tags_PostItemId",
                table: "Tags",
                column: "PostItemId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "PostItems");

            migrationBuilder.DropTable(
                name: "Authors");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
