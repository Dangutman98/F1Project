using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using server.Models;

namespace server.DAL
{
    public class DriverDal
    {
        private readonly string _connectionString;
        private readonly HttpClient _httpClient;

        // Constructor to accept both the connection string and HttpClient
        public DriverDal(string connectionString, HttpClient httpClient)
        {
            _connectionString = connectionString;
            _httpClient = httpClient; // Inject HttpClient
        }

        // Fetch drivers from OpenF1 API
        public async Task<List<Driver>> FetchDriversAsync()
        {
            var driverList = new List<Driver>();

            try
            {
                // Fetch data from OpenF1 API
                var response = await _httpClient.GetStringAsync("https://api.openf1.org/v1/drivers");

                // Log the raw response for debugging
                Console.WriteLine("Raw API Response: ");
                Console.WriteLine(response);

                // Deserialize the response directly into a list of DriverApiData
                var driverDataList = JsonConvert.DeserializeObject<List<DriverApiData>>(response);

                if (driverDataList != null && driverDataList.Any())
                {
                    foreach (var driver in driverDataList)
                    {
                        // Map the API response to the Driver model
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



        // Save drivers to SQL Server using a stored procedure
        public async Task SaveDriversToDatabaseAsync(List<Driver> drivers)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                foreach (var driver in drivers)
                {
                    try
                    {
                        string query = "SP_AddDriver"; // Stored Procedure name

                        using (SqlCommand cmd = new SqlCommand(query, connection))
                        {
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
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error inserting driver {driver.Name}: {ex.Message}");
                    }
                }
            }
        }
    }

    // Create a response model for deserializing the API response
    public class ApiResponse
    {
        public List<DriverApiData> Data { get; set; }
    }

    public class DriverApiData
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PhotoUrl { get; set; }
        public int TeamId { get; set; }
        public string AcronymName { get; set; }
    }
}