namespace server.Models
{
    public class GoogleLoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string PhotoURL { get; set; } = string.Empty;
        public string Uid { get; set; } = string.Empty;
    }
} 