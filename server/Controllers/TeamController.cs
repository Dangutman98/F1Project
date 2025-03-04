using Microsoft.AspNetCore.Mvc;
using server.DAL;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController(TeamDal teamDal) : ControllerBase
    {
        private readonly TeamDal _teamDal = teamDal;

        // GET: api/teams
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

        //POST: api/teams/save
        [HttpPost("save")]
        public async Task<ActionResult> SaveTeams()
        {
            try
            {
                // Fetch the latest team data
                var teams = await _teamDal.GetAllTeamsAsync();

                // Save teams to the database
                await _teamDal.SaveTeamsToDatabaseAsync(teams);

                return Ok("Teams saved successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        //PUT: api/teams/update
        [HttpPut("update/{id}")]
        public async Task<ActionResult> UpdateTeam(int id, [FromBody] Team team)
        {
            if (id != team.Id)
            {
                return BadRequest("ID in the URL does not match the ID in the body.");
            }

            await _teamDal.UpdateTeamAsync(team);
            return Ok($"Team with ID {id} updated successfully.");
        }




    }

}




