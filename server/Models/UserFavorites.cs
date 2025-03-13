namespace server.Models
{
    public class UserFavorites
    {
        public List<int> DriverIds { get; set; } = new List<int>();
        public List<int> TeamIds { get; set; } = new List<int>();
        public List<string> RacingSpots { get; set; } = new List<string>();
    }
} 