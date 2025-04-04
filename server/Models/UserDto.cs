
// This is the DataTransferObject for the User model. 
//Helping with the transfer of data between the client and the server.
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
