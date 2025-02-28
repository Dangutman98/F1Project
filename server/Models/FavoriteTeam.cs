namespace server.Models
{
    public class FavoriteTeam
    {
        private int userId;
        private string teamName;

        public int UserId { get => userId; set => userId = value; }
        public string TeamName { get => teamName; set => teamName = value; }

        // empty constructor
        public FavoriteTeam()
        {
        }

        public FavoriteTeam(int userId, string teamName)
        {
            UserId = userId;
            TeamName = teamName;
        }
    }
}


