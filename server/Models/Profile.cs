namespace server.Models
{
    public class Profile
    {
        public int UserId { get; set; } // Primary Key, Foreign Key to User
        public required string ProfilePicture { get; set; }
        public required string Description { get; set; }
    }
}
