namespace server.Models
{
    public class FavoriteRacingSpot
    {
        public int UserId { get; set; } // Foreign Key to User
        public required string SpotName { get; set; }
    }
}
