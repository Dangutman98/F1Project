using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using server.Models;
using System.Net.Http;

namespace server.DAL
{
    public class DriverDal
    {
        private readonly string _connectionString;
        private readonly HttpClient _httpClient;
        private const string OPENF1_API_URL = "https://api.openf1.org/v1/drivers";

        // Predefined list of current F1 drivers with their correct details
        private readonly List<Driver> CurrentDrivers = new()
        {
            new Driver(1, "Max VERSTAPPEN", "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/2col/image.png", "1", "VER"),
            new Driver(2, "Logan SARGEANT", "https://www.formula1.com/content/dam/fom-website/drivers/L/LOGSAR01_Logan_Sargeant/logsar01.png.transform/2col/image.png", "2", "SAR"),
            new Driver(4, "Lando NORRIS", "https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/2col/image.png", "3", "NOR"),
            new Driver(10, "Pierre GASLY", "https://www.formula1.com/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/2col/image.png", "4", "GAS"),
            new Driver(11, "Sergio PEREZ", "https://www.formula1.com/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/2col/image.png", "1", "PER"),
            new Driver(14, "Fernando ALONSO", "https://www.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/2col/image.png", "5", "ALO"),
            new Driver(16, "Charles LECLERC", "https://www.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/2col/image.png", "6", "LEC"),
            new Driver(18, "Lance STROLL", "https://www.formula1.com/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/2col/image.png", "5", "STR"),
            new Driver(20, "Kevin MAGNUSSEN", "https://www.formula1.com/content/dam/fom-website/drivers/K/KEVMAG01_Kevin_Magnussen/kevmag01.png.transform/2col/image.png", "7", "MAG"),
            new Driver(21, "Nyck DE VRIES", "https://www.formula1.com/content/dam/fom-website/drivers/N/NYCDEV01_Nyck_De%20Vries/nycdev01.png.transform/2col/image.png", "8", "DEV"),
            new Driver(22, "Yuki TSUNODA", "https://www.formula1.com/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png.transform/2col/image.png", "8", "TSU"),
            new Driver(23, "Alexander ALBON", "https://www.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/2col/image.png", "2", "ALB"),
            new Driver(24, "ZHOU Guanyu", "https://www.formula1.com/content/dam/fom-website/drivers/G/GUAZHO01_Guanyu_Zhou/guazho01.png.transform/2col/image.png", "9", "ZHO"),
            new Driver(27, "Nico HULKENBERG", "https://www.formula1.com/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/2col/image.png", "7", "HUL"),
            new Driver(31, "Esteban OCON", "https://www.formula1.com/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/2col/image.png", "4", "OCO"),
            new Driver(44, "Lewis HAMILTON", "https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/2col/image.png", "10", "HAM"),
            new Driver(55, "Carlos SAINZ", "https://www.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/2col/image.png", "6", "SAI"),
            new Driver(63, "George RUSSELL", "https://www.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/2col/image.png", "10", "RUS"),
            new Driver(77, "Valtteri BOTTAS", "https://www.formula1.com/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png.transform/2col/image.png", "9", "BOT"),
            new Driver(81, "Oscar PIASTRI", "https://www.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/2col/image.png", "3", "PIA")
        };

        public DriverDal(string connectionString)
        {
            _connectionString = connectionString;
            _httpClient = new HttpClient();
        }

        // Fetch drivers from OpenF1 API
        public async Task<List<Driver>> FetchDriversFromApiAsync()
        {
            try
            {
                // Return the predefined list of current drivers
                return CurrentDrivers;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching drivers: {ex.Message}");
                throw;
            }
        }

        // Fetch drivers from database
        public async Task<List<Driver>> FetchDriversFromDbAsync()
        {
            var driverList = new List<Driver>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using var command = new SqlCommand("SP_GetAllDrivers", connection)
                {
                    CommandType = System.Data.CommandType.StoredProcedure
                };
                
                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    driverList.Add(new Driver
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("Id")),
                        Name = reader.GetString(reader.GetOrdinal("Name")),
                        PhotoURL = reader.IsDBNull(reader.GetOrdinal("PhotoURL")) ? null : reader.GetString(reader.GetOrdinal("PhotoURL")),
                        TeamId = reader.IsDBNull(reader.GetOrdinal("TeamId")) ? null : reader.GetString(reader.GetOrdinal("TeamId")),
                        AcronymName = reader.IsDBNull(reader.GetOrdinal("AcronymName")) ? null : reader.GetString(reader.GetOrdinal("AcronymName"))
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
                    string insertQuery = @"
                        INSERT INTO Drivers (Id, Name, PhotoURL, TeamId, AcronymName)
                        VALUES (@Id, @Name, @PhotoURL, @TeamId, @AcronymName)";

                    using var command = new SqlCommand(insertQuery, conn);

                    command.Parameters.AddWithValue("@Id", driver.Id);
                    command.Parameters.AddWithValue("@Name", driver.Name);
                    command.Parameters.AddWithValue("@PhotoURL", (object)driver.PhotoURL ?? DBNull.Value);
                    command.Parameters.AddWithValue("@TeamId", (object)driver.TeamId ?? DBNull.Value);
                    command.Parameters.AddWithValue("@AcronymName", (object)driver.AcronymName ?? DBNull.Value);

                    try
                    {
                        await command.ExecuteNonQueryAsync();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error inserting driver {driver.Name}: {ex.Message}");
                    }
                }
            }
        }
    }
}