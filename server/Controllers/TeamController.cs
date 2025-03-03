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

        // Constructor to inject TeamDal
        public TeamController(TeamDal teamDal)
        {
            _teamDal = teamDal;
        }
        // GET: api/team/fetch
        [HttpGet("fetch")]
        public async Task<ActionResult<List<TeamApiData>>> FetchTeams()
        {
            var teams = await _teamDal.GetAllTeamsAsync();  // Fetch teams using the async method from DAL

            if (teams != null && teams.Count != 0)
            {
                return Ok(teams);  // Return the list of teams as JSON
            }
            else
            {
                return NotFound("No teams found");
            }
        }

        // GET: api/team
        [HttpGet]
        public ActionResult<List<TeamApiData>> GetAllTeams()
        {
            var teams = _teamDal.GetAllTeamsAsync();
            return Ok(teams); // Return all teams as a response
        }

        // GET: api/team/{id}
        [HttpGet("{id}")]
        public ActionResult<TeamApiData> GetTeamById(int id)
        {
            var team = _teamDal.GetTeamById(id);

            if (team == null)
            {
                return NotFound(); // Return 404 if team is not found
            }

            return Ok(team); // Return the team if found
        }
    }
}
