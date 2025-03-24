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

        // GET: api/Event/fetch - Fetch events from API
        [HttpGet("fetch")]
        public async Task<ActionResult<IEnumerable<Event>>> FetchEvents()
        {
            try
            {
                var events = await _eventDAL.FetchEventsFromApiAsync();
                if (events != null && events.Count != 0)
                {
                    return Ok(events);
                }
                return NotFound("No events found from API");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in FetchEvents: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Event - Get events from database
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

        // POST: api/Event/save/clearAndSave - Clear existing events and save new ones from API
        [HttpPost("save/clearAndSave")]
        public async Task<ActionResult> ClearAndSaveEvents()
        {
            try
            {
                Console.WriteLine("Deleting all events...");
                await _eventDAL.DeleteAllEventsAsync();

                Console.WriteLine("Fetching new events from API...");
                var events = await _eventDAL.FetchEventsFromApiAsync();

                if (events == null || !events.Any())
                {
                    return BadRequest("No events fetched from API.");
                }

                Console.WriteLine($"Fetched {events.Count} events.");

                Console.WriteLine("Saving events to database...");
                await _eventDAL.SaveEventsToDatabaseAsync(events);

                return Ok("All previous events were deleted, and new events were saved successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ClearAndSaveEvents: {ex.Message}");
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