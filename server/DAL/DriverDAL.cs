using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using server.Models;

namespace server.DAL
{
    public class DriverDal
    {
        private readonly HttpClient _httpClient;
        private readonly string _connectionString;
        private const string OpenF1ApiUrl = "https://api.openf1.org/v1/drivers";

        public DriverDal(HttpClient httpClient, string connectionString)
        {
            _httpClient = httpClient;
            _connectionString = connectionString;
        }

        // Fetch drivers from OpenF1 API
        public async Task<List<Driver>> FetchDriversAsync()
        {
            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync(OpenF1ApiUrl);

                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception($"Failed to fetch drivers: {response.StatusCode}");
                }

                string jsonResponse = await response.Content.ReadAsStringAsync();
                var drivers = JsonSerializer.Deserialize<List<Driver>>(jsonResponse, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                return drivers ?? new List<Driver>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching drivers: {ex.Message}");
                return new List<Driver>();
            }
        }

        // Save drivers to SQL Server
        public async Task SaveDriversToDatabaseAsync(List<Driver> drivers)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                foreach (var driver in drivers)
                {
                    string query = @"
                        IF NOT EXISTS (SELECT 1 FROM Drivers WHERE Id = @Id)
                        INSERT INTO Drivers (Id, Name, PhotoURL, TeamId, AcronymName)
                        VALUES (@Id, @Name, @PhotoURL, @TeamId, @AcronymName)";

                    using (SqlCommand cmd = new SqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@Id", driver.Id);
                        cmd.Parameters.AddWithValue("@Name", driver.Name);
                        cmd.Parameters.AddWithValue("@PhotoURL", driver.PhotoURL ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@TeamId", driver.TeamId ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@AcronymName", driver.AcronymName ?? (object)DBNull.Value);

                        await cmd.ExecuteNonQueryAsync();
                    }
                }
            }
        }
    }
}
