namespace server.Models
{
    public class FavoriteTeam
    {
        public int UserId { get; set; } // Foreign Key to User
        public required string TeamName { get; set; }
    }
}
