using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using server.Models;

namespace server.DAL
{
    public class DriverStandingsDAL
    {
        private readonly string _connectionString;
        private readonly ILogger<DriverStandingsDAL> _logger;

        public DriverStandingsDAL(IConfiguration configuration, ILogger<DriverStandingsDAL> logger)
        {
            _connectionString = configuration.GetConnectionString("F1ProjectDb") 
                ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger;
        }

        private decimal? ParseGapToLeader(string gap)
        {
            if (string.IsNullOrEmpty(gap) || gap == "—")
                return null;

            // Remove the '+' if present and try to parse
            gap = gap.TrimStart('+');
            if (decimal.TryParse(gap, out decimal result))
                return result;

            return null;
        }

        public async Task Save2023StandingsToDatabaseAsync(List<DriverStanding> standings)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                // Clear 2023 standings
                using (var command = new SqlCommand("DELETE FROM [dbo].[DriverStandings2023]", connection))
                {
                    await command.ExecuteNonQueryAsync();
                }

                // Insert new standings using 2023 stored procedure
                foreach (var standing in standings)
                {
                    using var command = new SqlCommand("SP_InsertDriverStandings2023", connection);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var driverId = await GetOrCreateDriverIdFromNameAsync(standing.DriverName);
                    var teamId = GetTeamIdFromName(standing.TeamName);

                    command.Parameters.AddWithValue("@DriverId", driverId);
                    command.Parameters.AddWithValue("@Position", standing.Position);
                    command.Parameters.AddWithValue("@Points", standing.Points);
                    command.Parameters.AddWithValue("@GapToLeader", standing.GapToLeader ?? "—");
                    command.Parameters.AddWithValue("@TeamId", teamId);

                    await command.ExecuteNonQueryAsync();
                }

                _logger.LogInformation("Successfully saved 2023 standings to database");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving 2023 standings to database");
                throw;
            }
        }

        public async Task Save2024StandingsToDatabaseAsync(List<DriverStanding> standings)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                // Clear 2024 standings
                using (var command = new SqlCommand("DELETE FROM [dbo].[DriverStandings2024]", connection))
                {
                    await command.ExecuteNonQueryAsync();
                }

                // Insert new standings using 2024 stored procedure
                foreach (var standing in standings)
                {
                    using var command = new SqlCommand("SP_InsertDriverStandings2024", connection);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var driverId = await GetOrCreateDriverIdFromNameAsync(standing.DriverName);
                    var teamId = GetTeamIdFromName(standing.TeamName);

                    command.Parameters.AddWithValue("@DriverId", driverId);
                    command.Parameters.AddWithValue("@Position", standing.Position);
                    command.Parameters.AddWithValue("@Points", standing.Points);
                    command.Parameters.AddWithValue("@GapToLeader", standing.GapToLeader ?? "—");
                    command.Parameters.AddWithValue("@TeamId", teamId);

                    await command.ExecuteNonQueryAsync();
                }

                _logger.LogInformation("Successfully saved 2024 standings to database");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving 2024 standings to database");
                throw;
            }
        }

        private async Task<int> GetOrCreateDriverIdFromNameAsync(string driverName)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            // First try to get existing driver
            using (var command = new SqlCommand(
                "SELECT Id FROM Drivers WHERE Name = @DriverName",
                connection))
            {
                command.Parameters.AddWithValue("@DriverName", driverName);
                var result = await command.ExecuteScalarAsync();
                if (result != null)
                    return (int)result;
            }

            // If driver doesn't exist, insert new driver using stored procedure
            using (var command = new SqlCommand("SP_InsertDriverDriverStandings", connection))
            {
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@Name", driverName);

                using var reader = await command.ExecuteReaderAsync();
                if (reader.Read())
                {
                    var newId = reader.GetInt32(0);  // Get the ID from the first column
                    _logger.LogInformation($"Created new driver: {driverName} with ID: {newId}");
                    return newId;
                }
                
                throw new Exception($"Failed to insert new driver: {driverName}");
            }
        }

        private int GetTeamIdFromName(string teamName)
        {
            // Map API team names to database team names
            var teamMapping = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "Red Bull Racing Honda RBPT", "Red Bull Racing" },
                { "Red Bull Racing RBPT", "Red Bull Racing" },
                { "RB Honda RBPT", "Red Bull Racing" },
                { "Mercedes-AMG Petronas F1 Team", "Mercedes" },
                { "Mercedes F1 Team", "Mercedes" },
                { "Scuderia Ferrari", "Ferrari" },
                { "Ferrari", "Ferrari" },
                { "McLaren F1 Team", "McLaren" },
                { "McLaren Mercedes", "McLaren" },
                { "Aston Martin Aramco Mercedes", "Aston Martin" },
                { "Aston Martin F1 Team", "Aston Martin" },
                { "Alpine Renault", "Alpine" },
                { "BWT Alpine F1 Team", "Alpine" },
                { "Williams Racing", "Williams" },
                { "Williams Mercedes", "Williams" },
                { "Visa Cash App RB F1 Team", "AlphaTauri" },
                { "AlphaTauri Honda RBPT", "AlphaTauri" },
                { "Kick Sauber Ferrari", "Alfa Romeo" },
                { "Alfa Romeo Ferrari", "Alfa Romeo" },
                { "MoneyGram Haas F1 Team", "Haas F1 Team" },
                { "Haas Ferrari", "Haas F1 Team" }
            };

            // Try to get the mapped team name
            var dbTeamName = teamMapping.TryGetValue(teamName, out var mappedName) ? mappedName : teamName;

            using var connection = new SqlConnection(_connectionString);
            connection.Open();

            using var command = new SqlCommand(
                "SELECT Id FROM Teams WHERE Name = @TeamName",
                connection);
            command.Parameters.AddWithValue("@TeamName", dbTeamName);

            var result = command.ExecuteScalar();
            if (result == null)
                throw new Exception($"Team not found: {teamName} (mapped to: {dbTeamName})");

            return (int)result;
        }

        public async Task<List<DriverStanding>> Get2023StandingsAsync()
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                var standings = new List<DriverStanding>();

                using var command = new SqlCommand(@"
                    SELECT 
                        d.Name as DriverName,
                        t.Name as TeamName,
                        ds.Position,
                        ds.Points,
                        ds.GapToLeader
                    FROM DriverStandings2023 ds
                    INNER JOIN Drivers d ON ds.DriverId = d.Id
                    INNER JOIN Teams t ON ds.TeamId = t.Id
                    ORDER BY ds.Position", connection);

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    standings.Add(new DriverStanding
                    {
                        DriverName = reader.GetString(reader.GetOrdinal("DriverName")),
                        TeamName = reader.GetString(reader.GetOrdinal("TeamName")),
                        Position = reader.GetInt32(reader.GetOrdinal("Position")),
                        Points = reader.GetInt32(reader.GetOrdinal("Points")),
                        GapToLeader = reader.GetString(reader.GetOrdinal("GapToLeader"))
                    });
                }

                return standings;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching 2023 standings from database");
                throw;
            }
        }

        public async Task<List<DriverStanding>> Get2024StandingsAsync()
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                var standings = new List<DriverStanding>();

                using var command = new SqlCommand(@"
                    SELECT 
                        d.Name as DriverName,
                        t.Name as TeamName,
                        ds.Position,
                        ds.Points,
                        ds.GapToLeader
                    FROM DriverStandings2024 ds
                    INNER JOIN Drivers d ON ds.DriverId = d.Id
                    INNER JOIN Teams t ON ds.TeamId = t.Id
                    ORDER BY ds.Position", connection);

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    standings.Add(new DriverStanding
                    {
                        DriverName = reader.GetString(reader.GetOrdinal("DriverName")),
                        TeamName = reader.GetString(reader.GetOrdinal("TeamName")),
                        Position = reader.GetInt32(reader.GetOrdinal("Position")),
                        Points = reader.GetInt32(reader.GetOrdinal("Points")),
                        GapToLeader = reader.GetString(reader.GetOrdinal("GapToLeader"))
                    });
                }

                return standings;
                        }
                        catch (Exception ex)
                        {
                _logger.LogError(ex, "Error fetching 2024 standings from database");
                throw;
            }
        }
    }
} 