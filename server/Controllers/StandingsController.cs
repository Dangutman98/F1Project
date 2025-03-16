using Microsoft.AspNetCore.Mvc;
using server.DAL;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StandingsController : ControllerBase
    {
        private readonly StandingsDAL _standingsDAL;

        public StandingsController(IConfiguration configuration)
        {
            _standingsDAL = new StandingsDAL(configuration.GetConnectionString("F1ProjectDb"));
        }

        [HttpGet("drivers/{season}")]
        public async Task<ActionResult<List<DriverStanding>>> GetDriverStandings(int season)
        {
            try
            {
                var standings = await _standingsDAL.GetDriverStandings(season);
                if (standings == null || !standings.Any())
                {
                    return NotFound(new { Message = "No driver standings found for the specified season" });
                }
                return Ok(standings);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving driver standings: {ex}");
                return StatusCode(500, new { Message = $"Error retrieving driver standings: {ex.Message}" });
            }
        }

        [HttpGet("constructors/{season}")]
        public async Task<ActionResult<List<ConstructorStanding>>> GetConstructorStandings(int season)
        {
            try
            {
                var standings = await _standingsDAL.GetConstructorStandings(season);
                if (standings == null || !standings.Any())
                {
                    return NotFound(new { Message = "No constructor standings found for the specified season" });
                }
                return Ok(standings);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving constructor standings: {ex}");
                return StatusCode(500, new { Message = $"Error retrieving constructor standings: {ex.Message}" });
            }
        }

        [HttpPost("update/{season}")]
        public async Task<IActionResult> UpdateStandings(int season)
        {
            try
            {
                if (season < 2023 || season > 2024)
                {
                    return BadRequest(new { Message = "Season must be 2023 or 2024" });
                }

                await _standingsDAL.UpdateStandingsFromOpenF1(season);
                
                // Get updated standings
                var driverStandings = await _standingsDAL.GetDriverStandings(season);
                var constructorStandings = await _standingsDAL.GetConstructorStandings(season);

                if ((driverStandings == null || !driverStandings.Any()) && 
                    (constructorStandings == null || !constructorStandings.Any()))
                {
                    return NotFound(new { Message = "No standings data available after update" });
                }

                return Ok(new { 
                    Message = "Standings updated successfully",
                    DriverStandings = driverStandings,
                    ConstructorStandings = constructorStandings
                });
            }
            catch (Exception ex)
            {
                // Log the full exception details
                Console.WriteLine($"Error updating standings: {ex}");
                return StatusCode(500, new { Message = $"Error updating standings: {ex.Message}" });
            }
        }
    }
} 