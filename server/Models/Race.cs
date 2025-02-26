namespace server.Models
{
    public class Race
    {
        public int Id { get; set; } // Primary Key
        public required string RaceName { get; set; }
        public DateTime RaceDate { get; set; }
        public required string Location { get; set; }
        public required string ImageUrl { get; set; }
    }
}
