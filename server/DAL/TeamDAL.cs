using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using server.Data; // Make sure to include this for your DbContext
using server.Models;

namespace server.DAL
{
    public class TeamDal
    {
        private readonly F1ProjectDbContext _context;
        private readonly HttpClient _httpClient; // Add this line
        private F1ProjectDbContext context;

        // Constructor to inject the DbContext and HttpClient
        public TeamDal(F1ProjectDbContext context, HttpClient httpClient) // Modify constructor
        {
            _context = context;
            _httpClient = httpClient; // Initialize HttpClient
        }

        public TeamDal(F1ProjectDbContext context)
        {
            this.context = context;
        }

        // Fetch all teams from the database
        public async Task<List<TeamApiData>> GetAllTeamsAsync()
        {
            return await _context.Teams
                                  .Select(t => new TeamApiData
                                  {
                                      Id = t.Id,
                                      Name = t.Name ?? string.Empty,
                                      TeamColour = t.Color ?? string.Empty
                                  })
                                  .ToListAsync();  // Use ToListAsync to make it asynchronous
        }

        // Fetch color from external API based on team name
        private async Task<string> GetTeamColorFromApi(string teamName)
        {
            try
            {
                var url = $"https://api.formula1.com/v1/teams?teamName={teamName}"; // Adjust API endpoint as necessary
                var response = await _httpClient.GetStringAsync(url);

                var apiResponse = JsonConvert.DeserializeObject<List<TeamApiData>>(response); // Use JsonConvert instead of JsonSerializer

                // Find team color from API response
                var team = apiResponse?.FirstOrDefault(t => t.Name.Equals(teamName, StringComparison.OrdinalIgnoreCase));
                return team?.TeamColour ?? "Unknown"; // Return color or "Unknown" if not found
            }
            catch (Exception)
            {
                return "Unknown"; // Fallback if API fails
            }
        }

        // Fetch a single team by Id
        public Team? GetTeamById(int id)
        {
            return _context.Teams.SingleOrDefault(t => t.Id == id);
        }
    }
    

public class TeamApiData
    {
        // Map the JSON properties to C# properties like the API provides.

        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public required string Name { get; set; }

        [JsonProperty("team_colour")]
        public required string TeamColour { get; set; }  // Maps to "team_colour" in the API response
    }

}
