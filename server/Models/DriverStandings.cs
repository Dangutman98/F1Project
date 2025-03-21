using System.Text.Json.Serialization;

namespace server.Models
{
    public class DriverStanding
    {
        [JsonPropertyName("position")]
        public int Position { get; set; }

        [JsonPropertyName("driverName")]
        public string DriverName { get; set; } = string.Empty;

        [JsonPropertyName("teamName")]
        public string TeamName { get; set; } = string.Empty;

        [JsonPropertyName("points")]
        public int Points { get; set; }

        [JsonPropertyName("gapToLeader")]
        public string GapToLeader { get; set; } = string.Empty;
    }

    public class StandingsData
    {
        [JsonPropertyName("year")]
        public int Year { get; set; }

        [JsonPropertyName("lastUpdated")]
        public DateTime LastUpdated { get; set; }

        [JsonPropertyName("standings")]
        public List<DriverStanding> Standings { get; set; } = new List<DriverStanding>();
    }
}
