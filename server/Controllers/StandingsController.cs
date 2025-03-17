using Microsoft.AspNetCore.Mvc;
using server.DAL;
using server.Models;
using Microsoft.Extensions.Logging;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StandingsController : ControllerBase
    {
        private readonly StandingsDAL _standingsDAL;
        private readonly ILogger<StandingsController> _logger;

        public StandingsController(StandingsDAL standingsDAL, ILogger<StandingsController> logger)
        {
            _standingsDAL = standingsDAL;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<DriverStanding>>> GetDriverStandings()
        {
            try
            {
                var standings = await _standingsDAL.GetDriverStandings();
                if (!standings.Any())
                {
                    return NotFound("No driver standings found");
                }
                return Ok(standings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving driver standings");
                return StatusCode(500, "An error occurred while retrieving driver standings");
            }
        }

        [HttpGet("constructors/{season}")]
        public async Task<ActionResult<List<ConstructorStandings>>> GetConstructorStandings(int season)
        {
            try
            {
                var standings = await _standingsDAL.GetConstructorStandings(season);
                if (!standings.Any())
                {
                    return NotFound($"No constructor standings found for season {season}");
                }
                return Ok(standings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving constructor standings for season {Season}", season);
                return StatusCode(500, "An error occurred while retrieving constructor standings");
            }
        }

        [HttpPost("update/{season}")]
        public async Task<IActionResult> UpdateStandings(int season)
        {
            try
            {
                if (season != 2023 && season != 2024)
                {
                    return BadRequest("Only 2023 and 2024 seasons are supported");
                }

                await _standingsDAL.UpdateStandings(season);
                return Ok($"Standings updated successfully for season {season}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating standings for season {Season}", season);
                return StatusCode(500, "An error occurred while updating standings");
            }
        }

        [HttpGet("{season}")]
        public async Task<ActionResult<StandingsResponse>> GetAllStandings(int season)
        {
            try
            {
                var response = new StandingsResponse
                {
                    DriverStandings = await _standingsDAL.GetDriverStandings(season),
                    ConstructorStandings = await _standingsDAL.GetConstructorStandings(season)
                };

                if (!response.DriverStandings.Any() && !response.ConstructorStandings.Any())
                {
                    return NotFound($"No standings found for season {season}");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all standings for season {Season}", season);
                return StatusCode(500, "An error occurred while retrieving standings");
            }
        }
    }
} 