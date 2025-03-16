using Microsoft.Data.SqlClient;
using System.Data;
using server.Models;

namespace server.DAL
{
    public class StandingsDAL
    {
        private readonly string _connectionString;

        public StandingsDAL(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<List<DriverStanding>> GetDriverStandings(int season)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("SP_GetDriverStandings", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@Season", season);

            var standings = new List<DriverStanding>();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                standings.Add(new DriverStanding
                {
                    Position = reader.GetInt32(reader.GetOrdinal("Position")),
                    Points = reader.GetDecimal(reader.GetOrdinal("Points")),
                    Wins = reader.GetInt32(reader.GetOrdinal("Wins")),
                    DriverName = reader.GetString(reader.GetOrdinal("DriverName")),
                    AcronymName = reader.GetString(reader.GetOrdinal("AcronymName")),
                    TeamName = reader.GetString(reader.GetOrdinal("TeamName")),
                    TeamColor = reader.GetString(reader.GetOrdinal("TeamColor"))
                });
            }

            return standings;
        }

        public async Task<List<ConstructorStanding>> GetConstructorStandings(int season)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("SP_GetConstructorStandings", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@Season", season);

            var standings = new List<ConstructorStanding>();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                standings.Add(new ConstructorStanding
                {
                    Position = reader.GetInt32(reader.GetOrdinal("Position")),
                    Points = reader.GetDecimal(reader.GetOrdinal("Points")),
                    Wins = reader.GetInt32(reader.GetOrdinal("Wins")),
                    TeamName = reader.GetString(reader.GetOrdinal("TeamName")),
                    TeamColor = reader.GetString(reader.GetOrdinal("TeamColor"))
                });
            }

            return standings;
        }

        public async Task UpdateDriverStanding(DriverStanding standing, int season)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("SP_UpdateDriverStandings", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@DriverId", standing.DriverId);
            command.Parameters.AddWithValue("@Position", standing.Position);
            command.Parameters.AddWithValue("@Points", standing.Points);
            command.Parameters.AddWithValue("@Wins", standing.Wins);
            command.Parameters.AddWithValue("@Season", season);

            await command.ExecuteNonQueryAsync();
        }

        public async Task UpdateConstructorStanding(ConstructorStanding standing, int season)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("SP_UpdateConstructorStandings", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@TeamId", standing.TeamId);
            command.Parameters.AddWithValue("@Position", standing.Position);
            command.Parameters.AddWithValue("@Points", standing.Points);
            command.Parameters.AddWithValue("@Wins", standing.Wins);
            command.Parameters.AddWithValue("@Season", season);

            await command.ExecuteNonQueryAsync();
        }

        public async Task UpdateStandingsFromOpenF1(int season)
        {
            using var httpClient = new HttpClient();
            
            // Get driver standings from OpenF1 API
            var driverStandingsUrl = $"https://api.openf1.org/v1/drivers?session_key=latest";
            var driverStandingsResponse = await httpClient.GetAsync(driverStandingsUrl);
            
            if (driverStandingsResponse.IsSuccessStatusCode)
            {
                var driverStandings = await driverStandingsResponse.Content.ReadFromJsonAsync<List<OpenF1DriverStanding>>();
                if (driverStandings != null && driverStandings.Any())
                {
                    foreach (var standing in driverStandings)
                    {
                        // Get the driver from our database using name
                        using var connection = new SqlConnection(_connectionString);
                        await connection.OpenAsync();
                        
                        var driverCommand = new SqlCommand(
                            "SELECT Id FROM Drivers WHERE Name LIKE @Name OR AcronymName LIKE @Code",
                            connection);
                        var driverName = $"{standing.FirstName} {standing.LastName}";
                        driverCommand.Parameters.AddWithValue("@Name", $"%{driverName}%");
                        driverCommand.Parameters.AddWithValue("@Code", $"%{standing.DriverCode}%");
                        
                        var driverId = await driverCommand.ExecuteScalarAsync() as int?;
                        
                        if (driverId.HasValue)
                        {
                            await UpdateDriverStanding(new DriverStanding
                            {
                                DriverId = driverId.Value,
                                Position = standing.Position,
                                Points = standing.Points,
                                Wins = standing.Wins
                            }, season);
                        }
                    }
                }
            }
            else
            {
                var errorContent = await driverStandingsResponse.Content.ReadAsStringAsync();
                throw new Exception($"Failed to fetch driver standings. Status: {driverStandingsResponse.StatusCode}, Error: {errorContent}");
            }

            // Get constructor standings from OpenF1 API
            var constructorStandingsUrl = $"https://api.openf1.org/v1/constructors?session_key=latest";
            var constructorStandingsResponse = await httpClient.GetAsync(constructorStandingsUrl);
            
            if (constructorStandingsResponse.IsSuccessStatusCode)
            {
                var constructorStandings = await constructorStandingsResponse.Content.ReadFromJsonAsync<List<OpenF1ConstructorStanding>>();
                if (constructorStandings != null && constructorStandings.Any())
                {
                    foreach (var standing in constructorStandings)
                    {
                        // Get the team from our database using name
                        using var connection = new SqlConnection(_connectionString);
                        await connection.OpenAsync();
                        
                        var teamCommand = new SqlCommand(
                            "SELECT Id FROM Teams WHERE Name LIKE @Name",
                            connection);
                        teamCommand.Parameters.AddWithValue("@Name", $"%{standing.TeamName}%");
                        
                        var teamId = await teamCommand.ExecuteScalarAsync() as int?;
                        
                        if (teamId.HasValue)
                        {
                            await UpdateConstructorStanding(new ConstructorStanding
                            {
                                TeamId = teamId.Value,
                                Position = standing.Position,
                                Points = standing.Points,
                                Wins = standing.Wins
                            }, season);
                        }
                    }
                }
            }
            else
            {
                var errorContent = await constructorStandingsResponse.Content.ReadAsStringAsync();
                throw new Exception($"Failed to fetch constructor standings. Status: {constructorStandingsResponse.StatusCode}, Error: {errorContent}");
            }
        }
    }
} 