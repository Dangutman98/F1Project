using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using server.Models;

namespace server.DAL
{
    public class DriverDal(string connectionString, HttpClient httpClient)
    {
        private readonly string _connectionString = connectionString;
        private readonly HttpClient _httpClient = httpClient;

        // Fetch drivers from OpenF1 API
        public async Task<List<Driver>> FetchDriversAsync()
        {
            var driverList = new List<Driver>();

            // List of relevant driver IDs
            var relevantDriverIds = new HashSet<int> { 1, 2, 4, 10, 11, 14, 16, 20, 21, 22, 24, 27, 31, 44, 55, 63, 81, 23, 77, 18 };

            try
            {
                // Fetch data from OpenF1 API
                var response = await _httpClient.GetStringAsync("https://api.openf1.org/v1/drivers");

                // Deserialize the response into a list of DriverApiData
                var driverDataList = JsonConvert.DeserializeObject<List<DriverApiData>>(response);

                if (driverDataList != null && driverDataList.Count != 0)
                {
                    // Filter out duplicate drivers by name and only keep those with relevant IDs
                    var uniqueDriverDataList = driverDataList
                   .Where(driver => relevantDriverIds.Contains(driver.Id)) // Keep only relevant IDs
                   .GroupBy(driver => driver.Id)  // Group by ID
                   .Select(group => group.First()) // Take only the first occurrence of each ID
                   .ToList();


                    foreach (var driver in uniqueDriverDataList)
                    {
                        driverList.Add(new Driver
                        {
                            Id = driver.Id,
                            Name = driver.Name,
                            PhotoURL = driver.PhotoUrl,
                            TeamId = driver.TeamId,
                            AcronymName = driver.AcronymName
                        });
                    }
                }
                else
                {
                    Console.WriteLine("No driver data found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching drivers: {ex.Message}");
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
            public required List<DriverApiData> Data { get; set; }
        }

        public class DriverApiData
        {
            // Map the JSON properties to C# properties like the api provides.

            [JsonProperty("driver_number")]
            public int Id { get; set; }

            [JsonProperty("full_name")]
            public required string Name { get; set; }

            [JsonProperty("headshot_url")]
            public required string PhotoUrl { get; set; }

            [JsonProperty("team_name")]
            public required string TeamId { get; set; }

            [JsonProperty("name_acronym")]
            public required string AcronymName { get; set; }
        }

        
    }
}