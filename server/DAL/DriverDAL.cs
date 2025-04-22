using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using server.Models;

namespace server.DAL
{
    public class DriverDal
    {
        private readonly string _connectionString;

        public DriverDal(string connectionString)
        {
            _connectionString = connectionString;
        }

        // Fetch drivers from database
        public async Task<List<Driver>> FetchDriversAsync()
        {
            var driverList = new List<Driver>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using var command = new SqlCommand(@"
                    SELECT d.Id, d.Name, d.PhotoURL, t.Name as TeamName, d.AcronymName 
                    FROM Drivers d 
                    INNER JOIN Teams t ON d.TeamId = t.Id 
                    ORDER BY d.Id", connection);
                
                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    driverList.Add(new Driver
                    {
                        Id = reader.GetInt32(0),
                        Name = reader.GetString(1),
                        PhotoURL = reader.GetString(2),
                        TeamId = reader.GetString(3),  // This is actually the team name
                        AcronymName = reader.GetString(4)
                    });
                }
            }

            return driverList;
        }

        //delete method
        public async Task DeleteAllDriversAsync()
        {
            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            string query = "DELETE FROM Drivers"; // Deletes all rows from the Drivers table

            using var cmd = new SqlCommand(query, connection);
            await cmd.ExecuteNonQueryAsync();
        }

        //post method to save drivers
        public async Task SaveDriversToDatabaseAsync(List<Driver> drivers)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                foreach (var driver in drivers)
                {
                    // Get the TeamId from Teams table
                    int? teamId = await GetTeamIdByNameAsync(conn, driver.TeamId);
                    if (teamId == null)
                    {
                        Console.WriteLine($"Error: No team found for driver {driver.Name}");
                        continue; // Skip this driver if no matching team
                    }

                    using (SqlCommand cmd = new SqlCommand(@"
INSERT INTO Drivers (Id, Name, PhotoURL, TeamId, AcronymName) 
VALUES (@Id, @Name, @PhotoURL, @TeamId, @AcronymName)", conn))
                    {
                        cmd.Parameters.AddWithValue("@Id", driver.Id); // Assuming the ID comes from your API
                        cmd.Parameters.AddWithValue("@Name", driver.Name);
                        cmd.Parameters.AddWithValue("@PhotoURL", (object)driver.PhotoURL ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@TeamId", teamId);
                        cmd.Parameters.AddWithValue("@AcronymName", (object)driver.AcronymName ?? DBNull.Value);

                        try
                        {
                            await cmd.ExecuteNonQueryAsync();
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error inserting driver {driver.Name}: {ex.Message}");
                        }
                    }

                }
            }
        }

        // Helper method to fetch TeamId by team name
        private async Task<int?> GetTeamIdByNameAsync(SqlConnection conn, string teamName)
        {
            using (SqlCommand cmd = new SqlCommand("SELECT Id FROM Teams WHERE Name = @TeamName", conn))
            {
                cmd.Parameters.AddWithValue("@TeamName", teamName);
                var result = await cmd.ExecuteScalarAsync();
                return result != null ? (int?)result : null;
            }
        }

        // Create a response model for deserializing the API response
        public class ApiResponse
        {
            public List<DriverApiData> Data { get; set; } = new List<DriverApiData>();
        }

        public class DriverApiData
        {
            [JsonProperty("driver_number")]
            public int DriverNumber { get; set; }

            [JsonProperty("full_name")]
            public string FullName { get; set; } = string.Empty;

            [JsonProperty("headshot_url")]
            public string HeadshotUrl { get; set; } = string.Empty;

            [JsonProperty("team_name")]
            public string TeamName { get; set; } = string.Empty;

            [JsonProperty("name_acronym")]
            public string NameAcronym { get; set; } = string.Empty;
        }
    }
}