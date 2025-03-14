namespace server.Models
{
    public class FavoriteDriver
    {
        public int DriverId { get; set; }
        public string DriverName { get; set; }
        public string PhotoURL { get; set; }
        public int TeamId { get; set; }
        public string AcronymName { get; set; }
        public string TeamName { get; set; }
        public string TeamColor { get; set; }

        // empty constructor
        public FavoriteDriver()
        {
        }

        public FavoriteDriver(int driverId, string driverName, string photoURL, int teamId, string acronymName, string teamName, string teamColor)
        {
            DriverId = driverId;
            DriverName = driverName;
            PhotoURL = photoURL;
            TeamId = teamId;
            AcronymName = acronymName;
            TeamName = teamName;
            TeamColor = teamColor;
        }
    }
}



