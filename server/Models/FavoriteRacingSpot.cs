namespace server.Models
{
    public class FavoriteRacingSpot
    {
        public int UserId { get; set; }
        public string SpotName { get; set; } = string.Empty;

        // empty constructor
        public FavoriteRacingSpot()
        {
        }

        public FavoriteRacingSpot(int userId, string spotName)
        {
            UserId = userId;
            SpotName = spotName;
        }
    }
}


