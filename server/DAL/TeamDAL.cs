﻿using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using server.Data; 
using server.Models;
using System.Data;
using static server.DAL.DriverDal;

namespace server.DAL
{
    public class TeamDal(string connectionString, HttpClient httpClient)
    {
        private readonly string _connectionString = connectionString;
        private readonly HttpClient _httpClient = httpClient;

        // Fetch all teams from the database
        public async Task<List<Team>> GetAllTeamsAsync()
        {
            var teamList = new List<Team>();

            try
            {
                // Fetch data from OpenF1 API
                var response = await _httpClient.GetStringAsync("https://api.openf1.org/v1/drivers");

                // Log the raw response for debugging
                //Console.WriteLine("Raw API Response:" + response);

                // Deserialize the response into a list of TeamApiData
                var teamDataList = JsonConvert.DeserializeObject<List<TeamApiData>>(response);

                if (teamDataList != null && teamDataList.Count != 0)
                {
                    // Filter out duplicate teams by name and take the first 10 unique teams
                    var uniqueTeamDataList = teamDataList
                        .GroupBy(team => team.Name) // Group by team name
                        .Select(group => group.First()) // Take the first team from each group (unique names)
                        .Take(10) // Limit to first 10 teams
                        .ToList();

                    int counter = 1; // Start counting from 1

                    foreach (var teamData in uniqueTeamDataList)
                    {
                        teamList.Add(new Team
                        {
                            Id = counter++, // Assign sequential IDs from 1 to 10
                            Name = teamData.Name,
                            Color = teamData.TeamColour
                        });
                    }
                }
                else
                {
                    Console.WriteLine("No team data found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching teams: {ex.Message}");
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
