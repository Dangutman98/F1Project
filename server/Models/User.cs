namespace server.Models
{
    public class User
    {
        public int Id { get; set; } // Primary Key
        public required string Username { get; set; }
        public required string PasswordHash { get; set; }
        public required string Email { get; set; }
        public required string FavoriteAnimal { get; set; }

        // Foreign Key references
        public int? FavoriteDriverId { get; set; }
        public int? FavoriteTeamId { get; set; }
        public int? FavoriteRacingSpotId { get; set; }
    }
}
