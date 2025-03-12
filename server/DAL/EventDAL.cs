using Microsoft.Data.SqlClient;
using server.Models;
using System.Data;

namespace server.DAL
{
    public class EventDAL
    {
        private readonly string _connectionString;

        public EventDAL(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<List<Event>> GetAllEventsAsync()
        {
            var events = new List<Event>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using var command = new SqlCommand("SELECT Id, RaceName, RaceDate, Location, ImageUrl FROM Events ORDER BY RaceDate", connection);
                
                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    events.Add(new Event
                    {
                        Id = reader.GetInt32(0),
                        RaceName = reader.GetString(1),
                        RaceDate = reader.GetDateTime(2),
                        Location = reader.GetString(3),
                        ImageUrl = reader.IsDBNull(4) ? string.Empty : reader.GetString(4)
                    });
                }
            }

            return events;
        }

        public async Task<bool> SetFavoriteRacingSpotAsync(int userId, string spotName)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("SetFavoriteRacingSpot", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@UserId", userId);
            command.Parameters.AddWithValue("@SpotName", spotName);

            try
            {
                await command.ExecuteNonQueryAsync();
                return true;
            }
            catch (SqlException ex)
            {
                Console.WriteLine($"SQL Exception: {ex.Message}");
                return false;
            }
        }

        public async Task<List<string>> GetFavoriteRacingSpotsAsync(int userId)
        {
            var spots = new List<string>();
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"
                SELECT SpotName
                FROM FavoriteRacingSpots
                WHERE UserId = @UserId";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@UserId", userId);

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                spots.Add(reader.GetString(0));
            }

            return spots;
        }

        public async Task<Event?> GetFavoriteRacingSpotAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"
                SELECT e.Id, e.RaceName, e.RaceDate, e.Location, e.ImageUrl
                FROM Events e
                INNER JOIN Users u ON e.Id = u.FavoriteRacingSpotId
                WHERE u.Id = @UserId";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@UserId", userId);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Event
                {
                    Id = reader.GetInt32(0),
                    RaceName = reader.GetString(1),
                    RaceDate = reader.GetDateTime(2),
                    Location = reader.GetString(3),
                    ImageUrl = reader.IsDBNull(4) ? string.Empty : reader.GetString(4)
                };
            }

            return null;
        }
    }
} 