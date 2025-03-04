using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data
{
    public class F1ProjectDbContext(DbContextOptions<F1ProjectDbContext> options) : DbContext(options)
    {

        // DbSet for Users
        public DbSet<User> Users { get; set; }

        // Add other DbSets as needed (for Teams, Drivers, etc.)
        public DbSet<Team> Teams { get; set; }
        public DbSet<Driver> Drivers { get; set; }
    }
}
