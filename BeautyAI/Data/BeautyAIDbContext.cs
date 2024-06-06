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

        public DbSet<Artist> Artists { get; set; } = null!;
        public DbSet<Service> Services { get; set; } = null!;
        public DbSet<Portfolio> Portfolios { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;
        public DbSet<All_review> All_Reviews { get; set; }
        public DbSet<Booking> Bookings { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Trend> Trends { get; set; } = null!;
        public DbSet<UserFavoriteTrend> UserFavoriteTrends { get; set; } = null!;
        public DbSet<SignUp> SignUps { get; set; } = null!;

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
            modelBuilder.Entity<UserFavoriteTrend>().ToTable("UserFavoriteTrends");
            modelBuilder.Entity<SignUp>().ToTable("SignUp");

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
            modelBuilder.Entity<SignUp>()
                .HasKey(s => s.SignUpId);

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

            modelBuilder.Entity<Booking>()
                .HasOne<SignUp>(b => b.SignUp)
                .WithMany(s => s.Bookings)
                .HasForeignKey(b => b.SignUpId);

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

            modelBuilder.Entity<UserFavoriteTrend>()
                .HasKey(uf => new { uf.UserId, uf.TrendId });

            modelBuilder.Entity<UserFavoriteTrend>()
                .HasOne<User>(uf => uf.User)
                .WithMany(u => u.FavoriteTrends)
                .HasForeignKey(uf => uf.UserId);

            modelBuilder.Entity<UserFavoriteTrend>()
                .HasOne<Trend>(uf => uf.Trend)
                .WithMany(t => t.Users)
                .HasForeignKey(uf => uf.TrendId);

            modelBuilder.Entity<SignUp>()
                .HasOne(s => s.Artist)
                .WithMany(a => a.SignUps)
                .HasForeignKey(s => s.ArtistId);
        }
    }
}
