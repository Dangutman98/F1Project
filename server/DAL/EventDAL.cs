using Microsoft.Data.SqlClient;
using server.Models;
using System.Data;

namespace server.DAL
{
    public class EventDAL
    {
        private readonly string _connectionString;

        // Predefined list of current F1 events
        private readonly List<Event> CurrentEvents = new()
        {
            new Event(1, "Bahrain Grand Prix", new DateTime(2024, 2, 29), "Sakhir, Bahrain", ""),
            new Event(2, "Saudi Arabian Grand Prix", new DateTime(2024, 3, 7), "Jeddah, Saudi Arabia", ""),
            new Event(3, "Australian Grand Prix", new DateTime(2024, 3, 22), "Melbourne, Australia", ""),
            new Event(4, "Japanese Grand Prix", new DateTime(2024, 4, 5), "Suzuka, Japan", ""),
            new Event(5, "Chinese Grand Prix", new DateTime(2024, 4, 19), "Shanghai, China", ""),
            new Event(6, "Miami Grand Prix", new DateTime(2024, 5, 3), "Miami, USA", ""),
            new Event(7, "Emilia Romagna Grand Prix", new DateTime(2024, 5, 17), "Imola, Italy", ""),
            new Event(8, "Monaco Grand Prix", new DateTime(2024, 5, 24), "Monte Carlo, Monaco", ""),
            new Event(9, "Canadian Grand Prix", new DateTime(2024, 6, 7), "Montreal, Canada", ""),
            new Event(10, "Spanish Grand Prix", new DateTime(2024, 6, 21), "Barcelona, Spain", ""),
            new Event(11, "Austrian Grand Prix", new DateTime(2024, 6, 28), "Spielberg, Austria", ""),
            new Event(12, "British Grand Prix", new DateTime(2024, 7, 5), "Silverstone, UK", ""),
            new Event(13, "Hungarian Grand Prix", new DateTime(2024, 7, 19), "Budapest, Hungary", ""),
            new Event(14, "Belgian Grand Prix", new DateTime(2024, 7, 26), "Spa-Francorchamps, Belgium", ""),
            new Event(15, "Dutch Grand Prix", new DateTime(2024, 8, 23), "Zandvoort, Netherlands", ""),
            new Event(16, "Italian Grand Prix", new DateTime(2024, 8, 31), "Monza, Italy", ""),
            new Event(17, "Azerbaijan Grand Prix", new DateTime(2024, 9, 13), "Baku, Azerbaijan", ""),
            new Event(18, "Singapore Grand Prix", new DateTime(2024, 9, 20), "Marina Bay, Singapore", ""),
            new Event(19, "United States Grand Prix", new DateTime(2024, 10, 18), "Austin, USA", ""),
            new Event(20, "Mexico City Grand Prix", new DateTime(2024, 10, 25), "Mexico City, Mexico", ""),
            new Event(21, "São Paulo Grand Prix", new DateTime(2024, 11, 1), "São Paulo, Brazil", ""),
            new Event(22, "Las Vegas Grand Prix", new DateTime(2024, 11, 21), "Las Vegas, USA", ""),
            new Event(23, "Qatar Grand Prix", new DateTime(2024, 11, 29), "Lusail, Qatar", ""),
            new Event(24, "Abu Dhabi Grand Prix", new DateTime(2024, 12, 6), "Yas Island, Abu Dhabi", "")
        };

        public EventDAL(string connectionString)
        {
            _connectionString = connectionString;
        }

        // New method to fetch events from predefined list
        public async Task<List<Event>> FetchEventsFromApiAsync()
        {
            try
            {
                return CurrentEvents;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching events: {ex.Message}");
                throw;
            }
        }

        // Method to delete all events
        public async Task DeleteAllEventsAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            string query = "DELETE FROM Events";

            using var cmd = new SqlCommand(query, connection);
            await cmd.ExecuteNonQueryAsync();
        }

        // Method to save events to database
        public async Task SaveEventsToDatabaseAsync(List<Event> events)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            foreach (var evt in events)
            {
                string insertQuery = @"
                    INSERT INTO Events (RaceName, RaceDate, Location, ImageUrl)
                    VALUES (@RaceName, @RaceDate, @Location, @ImageUrl)";

                using var command = new SqlCommand(insertQuery, connection);

                command.Parameters.AddWithValue("@RaceName", evt.RaceName);
                command.Parameters.AddWithValue("@RaceDate", evt.RaceDate);
                command.Parameters.AddWithValue("@Location", evt.Location);
                command.Parameters.AddWithValue("@ImageUrl", (object)evt.ImageUrl ?? DBNull.Value);

                try
                {
                    await command.ExecuteNonQueryAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error inserting event {evt.RaceName}: {ex.Message}");
                }
            }
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