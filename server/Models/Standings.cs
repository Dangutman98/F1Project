namespace server.Models
{
    public class Standings
    {
        private int id;
        private int raceId;
        private int driverId;
        private int position;
        private int points;

        public int Id { get => id; set => id = value; }
        public int RaceId { get => raceId; set => raceId = value; }
        public int DriverId { get => driverId; set => driverId = value; }
        public int Position { get => position; set => position = value; }
        public int Points { get => points; set => points = value; }

        // empty constructor
        public Standings()
        {
        }

        public Standings(int id, int raceId, int driverId, int position, int points)
        {
            Id = id;
            RaceId = raceId;
            DriverId = driverId;
            Position = position;
            Points = points;
        }
    }

    public class DriverStanding
    {
        public int DriverId { get; set; }
        public int Position { get; set; }
        public decimal Points { get; set; }
        public int Wins { get; set; }
        public string DriverName { get; set; }
        public string AcronymName { get; set; }
        public string TeamName { get; set; }
        public string TeamColor { get; set; }
    }

    public class ConstructorStanding
    {
        public int TeamId { get; set; }
        public int Position { get; set; }
        public decimal Points { get; set; }
        public int Wins { get; set; }
        public string TeamName { get; set; }
        public string TeamColor { get; set; }
    }

    // Models for OpenF1 API responses
    public class OpenF1DriverStanding
    {
        public int DriverId { get; set; }
        public int Position { get; set; }
        public decimal Points { get; set; }
        public int Wins { get; set; }
        public string DriverNumber { get; set; }
        public string DriverCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string TeamName { get; set; }
        public string BroadcastName { get; set; }
        public string FullName { get; set; }
        public string Abbreviation { get; set; }
        public string TeamColor { get; set; }
    }

    public class OpenF1ConstructorStanding
    {
        public int TeamId { get; set; }
        public string TeamName { get; set; }
        public string Color { get; set; }
        public int Position { get; set; }
        public decimal Points { get; set; }
        public int Wins { get; set; }
    }
}

