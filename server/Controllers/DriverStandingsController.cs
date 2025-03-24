using Microsoft.AspNetCore.Mvc;
using server.Models;
using System.Text.Json;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverStandingsController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<DriverStandingsController> _logger;

        public DriverStandingsController(
            IWebHostEnvironment environment,
            ILogger<DriverStandingsController> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        // GET: api/DriverStandings/2023
        [HttpGet("2023")]
        public async Task<ActionResult<List<DriverStanding>>> Get2023Standings()
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
                
                if (standingsData?.Standings == null)
                {
                    return NotFound("Invalid or empty standings data for 2023");
                }

                return Ok(standingsData.Standings);
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
                var jsonPath = Path.Combine(_environment.ContentRootPath, "Data", "standings-2024.json");
                if (!System.IO.File.Exists(jsonPath))
                {
                    return NotFound("No standings data found for 2024");
                }

                var jsonContent = await System.IO.File.ReadAllTextAsync(jsonPath);
                var standingsData = JsonSerializer.Deserialize<StandingsData>(jsonContent);
                
                if (standingsData?.Standings == null)
                {
                    return NotFound("Invalid or empty standings data for 2024");
                }

                return Ok(standingsData.Standings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching 2024 standings");
                return StatusCode(500, $"Error fetching 2024 standings: {ex.Message}");
            }
        }
    }
}
