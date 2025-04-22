// This is the DataTransferObject for the User model. 
//Helping with the transfer of data between the client and the server.
namespace server.Models
{
    public class UserDto
    {
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FavoriteAnimal { get; set; } = string.Empty;
    }
}
