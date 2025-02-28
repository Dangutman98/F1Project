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
}

