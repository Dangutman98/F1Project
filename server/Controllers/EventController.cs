using Microsoft.AspNetCore.Mvc;
using server.DAL;
using server.Models;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly EventDAL _eventDAL;

        public EventController(EventDAL eventDAL)
        {
            _eventDAL = eventDAL;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            try
            {
                var events = await _eventDAL.GetAllEventsAsync();
                return Ok(events);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("favorite/{userId}")]
        public async Task<ActionResult> SetFavoriteRacingSpot(int userId, [FromBody] string spotName)
        {
            try
            {
                var result = await _eventDAL.SetFavoriteRacingSpotAsync(userId, spotName);
                if (result)
                {
                    return Ok("Favorite racing spot set successfully");
                }
                return BadRequest("Failed to set favorite racing spot");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("favorite/all/{userId}")]
        public async Task<ActionResult<IEnumerable<string>>> GetFavoriteRacingSpots(int userId)
        {
            try
            {
                var spots = await _eventDAL.GetFavoriteRacingSpotsAsync(userId);
                if (spots.Any())
                {
                    return Ok(spots);
                }
                return NotFound("No favorite racing spots found for this user");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
} 