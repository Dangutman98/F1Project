using Microsoft.AspNetCore.Mvc;
using server.DAL;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly TeamDal _teamDal;

        public TeamController(TeamDal teamDal)
        {
            _teamDal = teamDal;
        }

        // GET: api/Team/fetch - Fetch teams from API
        [HttpGet("fetch")]
        public async Task<ActionResult<List<Team>>> FetchTeams()
        {
            try
            {
                var teams = await _teamDal.FetchTeamsFromApiAsync();

                if (teams != null && teams.Count != 0)
                {
                    return Ok(teams);
                }
                else
                {
                    return NotFound("No teams found from API");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in FetchTeams: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Team - Get teams from database
        [HttpGet]
        public async Task<ActionResult<List<Team>>> GetTeams()
        {
            try
            {
                var teams = await _teamDal.GetAllTeamsAsync();
                return Ok(teams);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        //POST: api/Team/save
        [HttpPost("save")]
        public async Task<ActionResult> SaveTeams()
        {
            try
            {
                // Fetch the latest team data from API
                var teams = await _teamDal.FetchTeamsFromApiAsync();

                if (teams == null || !teams.Any())
                {
                    return BadRequest("No teams fetched from API.");
                }

                // Save teams to the database
                await _teamDal.SaveTeamsToDatabaseAsync(teams);

                return Ok("Teams saved successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        //PUT: api/Team/update/{id}
        [HttpPut("update/{id}")]
        public async Task<ActionResult> UpdateTeam(int id, [FromBody] Team team)
        {
            if (id != team.Id)
            {
                return BadRequest("ID in the URL does not match the ID in the body.");
            }

            try
            {
                await _teamDal.UpdateTeamAsync(team);
                return Ok($"Team with ID {id} updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}




