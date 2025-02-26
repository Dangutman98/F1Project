// In server/Data/F1ProjectDbContext.cs
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data
{
    public class F1ProjectDbContext(DbContextOptions<F1ProjectDbContext> options) : DbContext(options)
    {

        // DbSets for all the models
        public DbSet<User> Users { get; set; }
        public DbSet<Standings> Standings { get; set; }
        public DbSet<Race> Races { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<FavoriteTeam> FavoriteTeams { get; set; }
        public DbSet<FavoriteRacingSpot> FavoriteRacingSpots { get; set; }
        public DbSet<FavoriteDriver> FavoriteDrivers { get; set; }
        public DbSet<Article> Articles { get; set; }
    }
}
