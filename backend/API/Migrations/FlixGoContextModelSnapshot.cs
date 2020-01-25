﻿// <auto-generated />
using System;
using API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace api.Migrations
{
    [DbContext(typeof(FlixGoContext))]
    partial class FlixGoContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.3-servicing-35854");

            modelBuilder.Entity("API.Models.Author", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("Url")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("Authors");
                });

            modelBuilder.Entity("API.Models.Category", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Color")
                        .IsRequired();

                    b.Property<string>("EnglishName")
                        .IsRequired();

                    b.Property<string>("FrenchName")
                        .IsRequired();

                    b.Property<string>("ImageAudio");

                    b.Property<string>("ImageText")
                        .IsRequired();

                    b.Property<string>("ImageVideo");

                    b.HasKey("Id");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("API.Models.PostItem", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Audio");

                    b.Property<int>("AuthorId");

                    b.Property<int>("CategoryId");

                    b.Property<DateTime>("Creation");

                    b.Property<string>("EnglishContent");

                    b.Property<string>("EnglishTitle");

                    b.Property<bool>("Favorite");

                    b.Property<string>("FrenchContent");

                    b.Property<string>("FrenchTitle");

                    b.Property<string>("Image");

                    b.Property<int>("Media");

                    b.Property<int>("ReadingTime");

                    b.Property<string>("SpreakerEpisodeId");

                    b.Property<string>("YoutubeVideoId");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.HasIndex("CategoryId");

                    b.ToTable("PostItems");
                });

            modelBuilder.Entity("API.Models.Tag", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.Property<int>("PostItemId");

                    b.Property<string>("language");

                    b.HasKey("Id");

                    b.HasIndex("PostItemId");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("API.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime>("CreatedTime");

                    b.Property<string>("DeletedBy");

                    b.Property<DateTime>("DeletedTime");

                    b.Property<string>("Email")
                        .IsRequired();

                    b.Property<string>("FirstName")
                        .IsRequired();

                    b.Property<string>("LastName")
                        .IsRequired();

                    b.Property<int>("Rights");

                    b.Property<int>("Status");

                    b.Property<int>("Subscription");

                    b.Property<string>("UpdatedBy");

                    b.Property<DateTime>("UpdatedTime");

                    b.Property<string>("UserName")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("API.Models.PostItem", b =>
                {
                    b.HasOne("API.Models.Author", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("API.Models.Category", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("API.Models.Tag", b =>
                {
                    b.HasOne("API.Models.PostItem", "PostItem")
                        .WithMany("Tags")
                        .HasForeignKey("PostItemId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
