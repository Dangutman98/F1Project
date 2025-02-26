namespace server.Models
{
    public class FavoriteDriver
    {
        public int UserId { get; set; } // Foreign Key to User
        public required string DriverName { get; set; }
    }
}
