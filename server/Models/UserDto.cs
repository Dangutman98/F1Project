namespace server.Models
{
    public class UserDto
    {
        public required string Username { get; set; }
        public required string PasswordHash { get; set; }
        public required string Email { get; set; }
        public required string FavoriteAnimal { get; set; }
    }
}
