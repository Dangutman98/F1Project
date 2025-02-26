namespace server.Models
{
    public class Standings
    {
        public int Id { get; set; } // Primary Key
        public int RaceId { get; set; } // Foreign Key to Race
        public int DriverId { get; set; } // Foreign Key to Driver
        public int Position { get; set; }
        public int Points { get; set; }
    }
}
