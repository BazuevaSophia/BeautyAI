using Microsoft.EntityFrameworkCore;
using BeautyAI.Models;

namespace BeautyAI.Data
{
    public class BeautyAIDbContext : DbContext
    {
        public BeautyAIDbContext(DbContextOptions<BeautyAIDbContext> options)
            : base(options)
        {

        }

        public DbSet<Artist> Artists { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Portfolio> Portfolios { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<All_review> All_Reviews { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Trend> Trends { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            modelBuilder.Entity<Artist>().ToTable("artist");
            modelBuilder.Entity<Service>().ToTable("service");
            modelBuilder.Entity<Portfolio>().ToTable("portfolio");
            modelBuilder.Entity<Review>().ToTable("review");
            modelBuilder.Entity<All_review>().ToTable("all_review");
            modelBuilder.Entity<Booking>().ToTable("booking");
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Trend>().ToTable("trend");

            modelBuilder.Entity<All_review>()
                .HasKey(r => r.ReviewId2);
            modelBuilder.Entity<Artist>()
                .HasKey(a => a.ArtistId);
            modelBuilder.Entity<Booking>()
                .HasKey(b => b.BookingId);
            modelBuilder.Entity<Portfolio>()
                .HasKey(b => b.PortfolioId);
            modelBuilder.Entity<Review>()
                .HasKey(r => r.ReviewId);
            modelBuilder.Entity<Service>()
                .HasKey(s => s.ServiceId);
            modelBuilder.Entity<Trend>()
                .HasKey(u => u.TrendId);
            modelBuilder.Entity<User>()
                .HasKey(u => u.UserId);

            modelBuilder.Entity<All_review>()
                .HasOne<User>(ar => ar.User)
                .WithMany(u => u.All_Reviews)
                .HasForeignKey(ar => ar.UserId);

            modelBuilder.Entity<Artist>()
               .HasOne<Portfolio>(a => a.Portfolio)
               .WithMany(p => p.Artists)
               .HasForeignKey(a => a.PortfolioId);

            modelBuilder.Entity<Booking>()
                .HasOne<User>(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.UserId);

            modelBuilder.Entity<Booking>()
                .HasOne<Artist>(b => b.Artist)
                .WithMany(a => a.Bookings)
                .HasForeignKey(b => b.ArtistId);

            modelBuilder.Entity<Booking>()
                .HasOne<Service>(b => b.Service)
                .WithMany(s => s.Bookings)
                .HasForeignKey(b => b.ServiceId);

            modelBuilder.Entity<Review>()
                .HasOne<User>(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId);

            modelBuilder.Entity<Review>()
                .HasOne<Artist>(r => r.Artist)
                .WithMany(a => a.Reviews)
                .HasForeignKey(r => r.ArtistId);

            modelBuilder.Entity<Service>()
                .HasOne<Artist>(s => s.Artist) 
                .WithMany(a => a.Services) 
                .HasForeignKey(s => s.ArtistId) 
                .IsRequired();


        }
    }
}
