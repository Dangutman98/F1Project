namespace server.Models
{
    public class User
    {
        //user properties
        private int id;
        private string username;
        private string passwordHash;
        private string email;
        private string favoriteAnimal;
        private int? favoriteDriverId;
        private int? favoriteTeamId;
        private int? favoriteRacingSpotId;

        //get/set
        public int Id { get => id; set => id = value; }
        public required string Username { get => username; set => username = value; }
        public string PasswordHash { get => passwordHash; set => passwordHash = value; }
        public required string Email { get => email; set => email = value; }
        public string FavoriteAnimal { get => favoriteAnimal; set => favoriteAnimal = value; }
        public int? FavoriteDriverId { get => favoriteDriverId; set => favoriteDriverId = value; }
        public int? FavoriteTeamId { get => favoriteTeamId; set => favoriteTeamId = value; }
        public int? FavoriteRacingSpotId { get => favoriteRacingSpotId; set => favoriteRacingSpotId = value; }

        // empty constructor
        public User()
        {
        }
        // constructor with parameters
        public User(int id, string username, string passwordHash, string email, string favoriteAnimal, int? favoriteDriverId, int? favoriteTeamId, int? favoriteRacingSpotId)
        {
            Id = id;
            Username = username;
            PasswordHash = passwordHash;
            Email = email;
            FavoriteAnimal = favoriteAnimal;
            FavoriteDriverId = favoriteDriverId;
            FavoriteTeamId = favoriteTeamId;
            FavoriteRacingSpotId = favoriteRacingSpotId;
        }
    }
    
}
