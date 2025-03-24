using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using server.Data; 
using server.Models;
using System.Data;
using static server.DAL.DriverDal;

namespace server.DAL
{
    public class TeamDal
    {
        private readonly string _connectionString;
        private readonly HttpClient _httpClient;

        // Predefined list of current F1 teams
        private readonly List<Team> CurrentTeams = new()
        {
            new Team(1, "Red Bull Racing", "#3671C6"),
            new Team(2, "Williams", "#37BEDD"),
            new Team(3, "McLaren", "#FF8700"),
            new Team(4, "Alpine", "#FF87BC"),
            new Team(5, "Aston Martin", "#358C75"),
            new Team(6, "Ferrari", "#F91536"),
            new Team(7, "Haas F1 Team", "#B6BABD"),
            new Team(8, "AlphaTauri", "#5E8FAA"),
            new Team(9, "Alfa Romeo", "#C92D4B"),
            new Team(10, "Mercedes", "#6CD3BF")
        };

        public TeamDal(string connectionString)
        {
            _connectionString = connectionString;
            _httpClient = new HttpClient();
        }

        // New method to fetch teams from API
        public async Task<List<Team>> FetchTeamsFromApiAsync()
        {
            try
            {
                // Return the predefined list of current teams
                return CurrentTeams;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching teams: {ex.Message}");
                throw;
            }
        }

        // Fetch all teams from the database
        public async Task<List<Team>> GetAllTeamsAsync()
        {
            var teamList = new List<Team>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using var command = new SqlCommand("SELECT Id, Name, Color FROM Teams ORDER BY Id", connection);
                
                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    teamList.Add(new Team
                    {
                        Id = reader.GetInt32(0),
                        Name = reader.GetString(1),
                        Color = reader.GetString(2)
                    });
                }
            }

            return teamList;
        }

        //method to save teams to databas
        public async Task SaveTeamsToDatabaseAsync(List<Team> teams)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            foreach (var team in teams)
            {
                using var command = new SqlCommand("SP_SaveTeams", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.AddWithValue("@TeamId", team.Id);
                command.Parameters.AddWithValue("@TeamName", team.Name);
                command.Parameters.AddWithValue("@TeamColor", team.Color);

                await command.ExecuteNonQueryAsync();
            }
        }

        //method to update team by ID 

        public async Task UpdateTeamAsync(Team team)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("SP_UpdateTeam", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@TeamId", team.Id);
            command.Parameters.AddWithValue("@TeamName", team.Name);
            command.Parameters.AddWithValue("@TeamColor", team.Color);

            await command.ExecuteNonQueryAsync();
        }

        public class TeamApiData
        {
            // Map the JSON properties to C# properties like the API provides.
            public int Id { get; set; }

            [JsonProperty("team_name")]
            public required string Name { get; set; }

            [JsonProperty("team_colour")]
            public required string TeamColour { get; set; }  // Maps to "team_colour" in the API response
        }
    }
}
