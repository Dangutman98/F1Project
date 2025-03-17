using System.Data;
using System.Data.SqlClient;
using server.Models;
using Microsoft.Extensions.Logging;

namespace server.DAL
{
    public class StandingsDAL
    {
        private readonly string _connectionString;
        private readonly ILogger<StandingsDAL> _logger;

        public StandingsDAL(string connectionString, ILogger<StandingsDAL> logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        public async Task<List<DriverStanding>> GetDriverStandings()
        {
            var driverStandings = new List<DriverStanding>();

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand("SP_GetDriverStandings", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                driverStandings.Add(new DriverStanding
                                {
                                    Position = reader.GetInt32(reader.GetOrdinal("Position")),
                                    DriverName = reader.GetString(reader.GetOrdinal("DriverName")),
                                    TeamName = reader.GetString(reader.GetOrdinal("TeamName")),
                                    Points = reader.GetInt32(reader.GetOrdinal("Points")),
                                    GapToLeader = reader.IsDBNull(reader.GetOrdinal("GapToLeader")) ? "—" : reader.GetString(reader.GetOrdinal("GapToLeader"))
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting driver standings");
                throw;
            }

            return driverStandings;
        }

        public async Task<List<ConstructorStandings>> GetConstructorStandings(int season)
        {
            var constructorStandings = new List<ConstructorStandings>();

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand("SP_GetConstructorStandings", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@Season", season);

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                constructorStandings.Add(new ConstructorStandings
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                    TeamId = reader.GetInt32(reader.GetOrdinal("TeamId")),
                                    Position = reader.GetInt32(reader.GetOrdinal("Position")),
                                    Points = reader.GetDecimal(reader.GetOrdinal("Points")),
                                    Wins = reader.GetInt32(reader.GetOrdinal("Wins")),
                                    TeamName = reader.GetString(reader.GetOrdinal("TeamName")),
                                    TeamColor = reader.GetString(reader.GetOrdinal("TeamColor")),
                                    Season = season,
                                    GapToLeader = reader.GetDecimal(reader.GetOrdinal("GapToLeader"))
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting constructor standings for season {Season}", season);
                throw;
            }

            return constructorStandings;
        }

        public async Task UpdateStandings(int season)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand("SP_UpdateStandings", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@Season", season);
                        await command.ExecuteNonQueryAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating standings for season {Season}", season);
                throw;
            }
        }
    }
} 