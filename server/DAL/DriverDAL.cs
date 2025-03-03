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

            try
            {
                // Fetch data from OpenF1 API
                var response = await _httpClient.GetStringAsync("https://api.openf1.org/v1/drivers");

                // Log the raw response for debugging
                Console.WriteLine("Raw API Response:" + response);

                // Deserialize the response directly into a list of DriverApiData
                var driverDataList = JsonConvert.DeserializeObject<List<DriverApiData>>(response);

                if (driverDataList != null && driverDataList.Count != 0)
                {
                    // Filter out duplicate drivers by their names
                    var uniqueDriverDataList = driverDataList
                        .GroupBy(driver => driver.Name) // Group by driver name
                        .Select(group => group.First()) // Take the first driver from each group (unique names)
                        .ToList();

                    foreach (var driver in uniqueDriverDataList)
                    {
                        // Map the API response to the Driver model
                        driverList.Add(new Driver
                        {
                            Id = driver.Id,
                            Name = driver.Name,
                            PhotoURL = driver.PhotoUrl,
                            TeamId = int.TryParse(driver.TeamId, out int teamId) ? teamId : (int?)null,
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
            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            foreach (var driver in drivers)
            {
                try
                {
                    string query = "SP_AddDriver"; // Stored Procedure name

                    using var cmd = new SqlCommand(query, connection);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    // Add parameters matching the stored procedure
                    cmd.Parameters.AddWithValue("@Id", driver.Id);
                    cmd.Parameters.AddWithValue("@Name", driver.Name);
                    cmd.Parameters.AddWithValue("@PhotoURL", driver.PhotoURL ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@TeamId", driver.TeamId ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@AcronymName", driver.AcronymName ?? (object)DBNull.Value);

                    // Execute the stored procedure
                    await cmd.ExecuteNonQueryAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error inserting/updating driver {driver.Name}: {ex.Message}");
                }
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

        //method to get team id by name
        public async Task<int?> GetTeamIdAsync(string teamName)
        {
            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            // Check if the team already exists
            string checkTeamQuery = "SELECT Id FROM Teams WHERE Name = @TeamName";
            using var cmd = new SqlCommand(checkTeamQuery, connection);
            cmd.Parameters.AddWithValue("@TeamName", teamName);

            var result = await cmd.ExecuteScalarAsync();
            if (result != null)
            {
                // Return the existing team's Id
                return (int?)result;
            }
            else
            {
                // Insert the new team and return the new team Id
                string insertTeamQuery = "INSERT INTO Teams (Name) OUTPUT INSERTED.Id VALUES (@TeamName)";
                using var insertCmd = new SqlCommand(insertTeamQuery, connection);
                insertCmd.Parameters.AddWithValue("@TeamName", teamName);

                var insertedTeamId = await insertCmd.ExecuteScalarAsync();
                return (int?)insertedTeamId;
            }
        }
    }
}