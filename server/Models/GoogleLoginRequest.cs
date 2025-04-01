namespace server.Models
{
    public class GoogleLoginRequest
    {
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string PhotoURL { get; set; }
        public string Uid { get; set; }
    }
} 