namespace server.Models
{
    public class FavoriteRacingSpot
    {
        private int userId;
        private string spotName;

        public int UserId { get => userId; set => userId = value; }
        public string SpotName { get => spotName; set => spotName = value; }

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


