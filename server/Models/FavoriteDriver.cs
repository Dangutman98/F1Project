namespace server.Models
{
    public class FavoriteDriver
    {
        private int userId;
        private string driverName;

        public int UserId { get => userId; set => userId = value; }
        public string DriverName { get => driverName; set => driverName = value; }

        // empty constructor
        public FavoriteDriver()
        {
        }

        public FavoriteDriver(int userId, string driverName)
        {
            UserId = userId;
            DriverName = driverName;
        }
    }
}



