namespace server.Models
{
    public class RacingSpot
    {
        private int id;
        private string spotName;
        private string description;
        private string imageUrl;

        public int Id { get => id; set => id = value; }
        public string SpotName { get => spotName; set => spotName = value; }
        public string Description { get => description; set => description = value; }
        public string ImageUrl { get => imageUrl; set => imageUrl = value; }

        // Empty constructor
        public RacingSpot()
        {
        }

        // Constructor with parameters
        public RacingSpot(int id, string spotName, string description, string imageUrl)
        {
            Id = id;
            SpotName = spotName;
            Description = description;
            ImageUrl = imageUrl;
        }
    }
} 