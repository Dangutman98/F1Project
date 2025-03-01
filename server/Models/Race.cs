namespace server.Models
{
    public class Race
    {
        private int id;
        private string raceName;
        private DateTime raceDate;
        private string location;
        private string imageUrl;

        public int Id { get => id; set => id = value; }
        public string RaceName { get => raceName; set => raceName = value; }
        public DateTime RaceDate { get => raceDate; set => raceDate = value; }
        public string Location { get => location; set => location = value; }
        public string ImageUrl { get => imageUrl; set => imageUrl = value; }

        // empty constructor
        public Race()
        {
            raceName = string.Empty;
            location = string.Empty;
            imageUrl = string.Empty;
        }

        public Race(int id, string raceName, DateTime raceDate, string location, string imageUrl)
        {
            Id = id;
            RaceName = raceName;
            RaceDate = raceDate;
            Location = location;
            ImageUrl = imageUrl;
        }
    }
}
