namespace server.Models
{
    public class DriverStanding
    {
        public int Position { get; set; }
        public string DriverName { get; set; }
        public string TeamName { get; set; }
        public int Points { get; set; }
        public string GapToLeader { get; set; }

        public DriverStanding()
        {
            DriverName = string.Empty;
            TeamName = string.Empty;
            GapToLeader = string.Empty;
        }
    }

    public class ConstructorStandings
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public int Position { get; set; }
        public decimal Points { get; set; }
        public int Wins { get; set; }
        public string TeamName { get; set; }
        public string TeamColor { get; set; }
        public int Season { get; set; }
        public decimal GapToLeader { get; set; }

        public ConstructorStandings()
        {
            TeamName = string.Empty;
            TeamColor = string.Empty;
        }
    }

    // API Response model
    public class StandingsResponse
    {
        public List<DriverStanding> DriverStandings { get; set; }
        public List<ConstructorStandings> ConstructorStandings { get; set; }

        public StandingsResponse()
        {
            DriverStandings = new List<DriverStanding>();
            ConstructorStandings = new List<ConstructorStandings>();
        }
    }
}
