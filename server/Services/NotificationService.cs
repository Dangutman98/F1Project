using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace Server.Services
{
    public class NotificationService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly string _vapidPrivateKey = "B6uexuAGYoeM6nagi6foMk3paLvxeBlkPs4lVxtbsWI";

        public NotificationService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _httpClient = httpClientFactory.CreateClient();
            _httpClient.BaseAddress = new Uri("https://fcm.googleapis.com/fcm/");
        }

        public async Task SendNotificationAsync(string token, string title, string body, Dictionary<string, string>? data = null)
        {
            var message = new
            {
                to = token,
                notification = new
                {
                    title = title,
                    body = body,
                    icon = "/favicon.ico"
                },
                data = data
            };

            var json = JsonSerializer.Serialize(message);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", $"key={_vapidPrivateKey}");

            try
            {
                var response = await _httpClient.PostAsync("send", content);
                var responseContent = await response.Content.ReadAsStringAsync();
                
                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception($"Failed to send notification: {responseContent}");
                }
                
                Console.WriteLine($"Successfully sent message: {responseContent}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending message: {ex.Message}");
                throw;
            }
        }

        public async Task SendMulticastNotificationAsync(List<string> tokens, string title, string body, Dictionary<string, string>? data = null)
        {
            var message = new
            {
                registration_ids = tokens,
                notification = new
                {
                    title = title,
                    body = body,
                    icon = "/favicon.ico"
                },
                data = data
            };

            var json = JsonSerializer.Serialize(message);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", $"key={_vapidPrivateKey}");

            try
            {
                var response = await _httpClient.PostAsync("send", content);
                var responseContent = await response.Content.ReadAsStringAsync();
                
                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception($"Failed to send multicast notification: {responseContent}");
                }
                
                Console.WriteLine($"Successfully sent multicast message: {responseContent}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending multicast message: {ex.Message}");
                throw;
            }
        }
    }
} 