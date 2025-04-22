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

        public TeamDal(string connectionString)
        {
            _connectionString = connectionString;
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
            public string Name { get; set; } = string.Empty;

            [JsonProperty("team_colour")]
            public string TeamColour { get; set; } = string.Empty;  // Maps to "team_colour" in the API response
        }
    }
}
