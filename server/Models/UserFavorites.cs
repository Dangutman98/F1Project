namespace server.Models
{
    // The FavoriteDriver and FavoriteTeam classes are defined in their own files
    public class UserFavorites
    {
        public List<FavoriteDriver> Drivers { get; set; } = new List<FavoriteDriver>();
        public List<FavoriteTeam> Teams { get; set; } = new List<FavoriteTeam>();
        public List<string> RacingSpots { get; set; } = new List<string>();
    }
} 