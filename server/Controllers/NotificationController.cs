using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Services;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationService _notificationService;

        public NotificationController(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpPost("test")]
        public async Task<IActionResult> TestNotification([FromBody] string token)
        {
            try
            {
                await _notificationService.SendNotificationAsync(
                    token,
                    "Test Notification",
                    "This is a test notification from the backend!",
                    new Dictionary<string, string> {
                        { "test", "true" }
                    }
                );
                return Ok(new { message = "Test notification sent successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendNotification([FromBody] NotificationRequest request)
        {
            try
            {
                await _notificationService.SendNotificationAsync(
                    request.Token,
                    request.Title,
                    request.Body,
                    request.Data
                );
                return Ok(new { message = "Notification sent successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("send-multicast")]
        public async Task<IActionResult> SendMulticastNotification([FromBody] MulticastNotificationRequest request)
        {
            try
            {
                await _notificationService.SendMulticastNotificationAsync(
                    request.Tokens,
                    request.Title,
                    request.Body,
                    request.Data
                );
                return Ok(new { message = "Multicast notification sent successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class NotificationRequest
    {
        public string Token { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public Dictionary<string, string>? Data { get; set; }
    }

    public class MulticastNotificationRequest
    {
        public List<string> Tokens { get; set; } = new();
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public Dictionary<string, string>? Data { get; set; }
    }
} 