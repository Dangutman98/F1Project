using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.DAL;
using System.Text.Json;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverStandingsController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly DriverStandingsDAL _driverStandingsDAL;
        private readonly ILogger<DriverStandingsController> _logger;

        public DriverStandingsController(
            IWebHostEnvironment environment,
            DriverStandingsDAL driverStandingsDAL,
            ILogger<DriverStandingsController> logger)
        {
            _environment = environment;
            _driverStandingsDAL = driverStandingsDAL;
            _logger = logger;
        }

        // GET: api/DriverStandings/2023
        [HttpGet("2023")]
        public async Task<ActionResult<List<DriverStanding>>> Get2023Standings()
        {
            try
            {
                var standings = await _driverStandingsDAL.Get2023StandingsAsync();
                if (!standings.Any())
                {
                    return NotFound("No standings data found for 2023");
                }
                
                return Ok(standings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching 2023 standings");
                return StatusCode(500, $"Error fetching 2023 standings: {ex.Message}");
            }
        }

        // GET: api/DriverStandings/2024
        [HttpGet("2024")]
        public async Task<ActionResult<List<DriverStanding>>> Get2024Standings()
        {
            try
            {
                var standings = await _driverStandingsDAL.Get2024StandingsAsync();
                if (!standings.Any())
                {
                    return NotFound("No standings data found for 2024");
                }
                
                return Ok(standings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching 2024 standings");
                return StatusCode(500, $"Error fetching 2024 standings: {ex.Message}");
            }
        }

        // POST: api/DriverStandings/save-to-db/2023
        [HttpPost("save-to-db/2023")]
        public async Task<ActionResult> Save2023StandingsToDatabase()
        {
            try
            {
                var jsonPath = Path.Combine(_environment.ContentRootPath, "Data", "standings-2023.json");
                if (!System.IO.File.Exists(jsonPath))
                {
                    return NotFound("No standings data found for 2023");
                }

                var jsonContent = await System.IO.File.ReadAllTextAsync(jsonPath);
                var standingsData = JsonSerializer.Deserialize<StandingsData>(jsonContent);
                
                await _driverStandingsDAL.Save2023StandingsToDatabaseAsync(standingsData.Standings);
                return Ok("2023 standings saved to database successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving 2023 standings to database");
                return StatusCode(500, $"Error saving 2023 standings to database: {ex.Message}");
            }
        }

        // POST: api/DriverStandings/save-to-db/2024
        [HttpPost("save-to-db/2024")]
        public async Task<ActionResult> Save2024StandingsToDatabase()
        {
            try
            {
                var jsonPath = Path.Combine(_environment.ContentRootPath, "Data", "standings-2024.json");
                if (!System.IO.File.Exists(jsonPath))
                {
                    return NotFound("No standings data found for 2024");
                }

                var jsonContent = await System.IO.File.ReadAllTextAsync(jsonPath);
                var standingsData = JsonSerializer.Deserialize<StandingsData>(jsonContent);
                
                await _driverStandingsDAL.Save2024StandingsToDatabaseAsync(standingsData.Standings);
                return Ok("2024 standings saved to database successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving 2024 standings to database");
                return StatusCode(500, $"Error saving 2024 standings to database: {ex.Message}");
            }
        }
    }
}
