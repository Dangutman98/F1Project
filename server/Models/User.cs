using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        private string? profilePhoto;

        //get/set
        public int Id { get => id; set => id = value; }
        public string Username { get => username; set => username = value; }
        public string PasswordHash { get => passwordHash; set => passwordHash = value; }
        public string Email { get => email; set => email = value; }
        public string FavoriteAnimal { get => favoriteAnimal; set => favoriteAnimal = value; }
        public int? FavoriteDriverId { get => favoriteDriverId; set => favoriteDriverId = value; }
        public int? FavoriteTeamId { get => favoriteTeamId; set => favoriteTeamId = value; }
        public int? FavoriteRacingSpotId { get => favoriteRacingSpotId; set => favoriteRacingSpotId = value; }
        public string? ProfilePhoto { get => profilePhoto; set => profilePhoto = value; }

        // empty constructor
        public User()
        {
        }
        // constructor with parameters
        public User(int id, string username, string passwordHash, string email, string favoriteAnimal, int? favoriteDriverId, int? favoriteTeamId, int? favoriteRacingSpotId, string? profilePhoto = null)
        {
            Id = id;
            Username = username;
            PasswordHash = passwordHash;
            Email = email;
            FavoriteAnimal = favoriteAnimal;
            FavoriteDriverId = favoriteDriverId;
            FavoriteTeamId = favoriteTeamId;
            FavoriteRacingSpotId = favoriteRacingSpotId;
            ProfilePhoto = profilePhoto;
        }
    }
    
}
