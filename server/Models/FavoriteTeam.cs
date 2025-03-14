namespace server.Models
{
    public class FavoriteTeam
    {
        public int TeamId { get; set; }
        public string TeamName { get; set; }
        public string Color { get; set; }

        // empty constructor
        public FavoriteTeam()
        {
        }

        public FavoriteTeam(int teamId, string teamName, string color)
        {
            TeamId = teamId;
            TeamName = teamName;
            Color = color;
        }
    }
}


