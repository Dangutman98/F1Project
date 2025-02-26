
using Microsoft.EntityFrameworkCore;

namespace server.Data
{
    public class userDB : DbContext
    {
        public userDB(DbContextOptions<userDB> options)
            : base(options)
        {
        }

        // Define a DbSet for your Users table
        public DbSet<User> Users { get; set; }
    }
}
