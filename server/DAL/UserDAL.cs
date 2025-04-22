using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using server.Models;
using System.Data;

namespace server.DAL
{
    public class UserDAL
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

       //
        public UserDAL(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("igroup179_prod") ?? throw new InvalidOperationException("Connection string 'igroup179_prod' not found.");
        }


        // Method to check if a user exists based on username and password hash
        public bool CheckUserCredentials(string username, string passwordHash)
        {
            SqlConnection? con = null;
            SqlCommand cmd;

            try
            {
                con = connect();
                con.Open();

                // SQL command to check if the user exists
                cmd = new SqlCommand("SELECT COUNT(1) FROM Users WHERE Username = @Username AND PasswordHash = @PasswordHash", con);
                cmd.Parameters.AddWithValue("@Username", username);
                cmd.Parameters.AddWithValue("@PasswordHash", passwordHash);

                // Execute the command
                int userCount = (int)cmd.ExecuteScalar();

                return userCount > 0; // If count > 0, user exists with matching credentials
            }
            catch (SqlException sqlEx)
            {
                Console.WriteLine($"SQL Exception: {sqlEx.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                throw;
            }
            finally
            {
                con?.Close();
            }
        }



        ////////////////// Method to create a new user using UserDto/////////////////
        public int AddNewUserToDB(UserDto userDto)
        {
            SqlConnection? con = null;
            SqlCommand cmd;

            try
            {
                con = connect(); // Create the connection
                con.Open(); // Ensure the connection is open

                cmd = BuildAddNewUserToDBCommand(con, userDto); // Create the command

                cmd.ExecuteNonQuery(); // Execute stored procedure

                // Retrieve the new user ID from the output parameter
                int userID = Convert.ToInt32(cmd.Parameters["@NewUserID"].Value);
                return userID;
            }
            catch (SqlException sqlEx)
            {
                Console.WriteLine($"SQL Exception in AddNewUserToDB: {sqlEx.Message}");
                Console.WriteLine($"Error Number: {sqlEx.Number}");
                Console.WriteLine($"Error State: {sqlEx.State}");
                Console.WriteLine($"Procedure: {sqlEx.Procedure}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in AddNewUserToDB: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw;
            }
            finally
            {
                con?.Close();
            }
        }

        // Build the SQL command for adding a new user
        private SqlCommand BuildAddNewUserToDBCommand(SqlConnection con, UserDto userDto)
        {
            SqlCommand cmd = new SqlCommand("SP_AddNewUser", con);
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Username", userDto.Username);
            cmd.Parameters.AddWithValue("@PasswordHash", userDto.PasswordHash);  // Assuming the password is already hashed
            cmd.Parameters.AddWithValue("@Email", userDto.Email);
            cmd.Parameters.AddWithValue("@FavoriteAnimal", userDto.FavoriteAnimal);

            // Output parameter to retrieve the new User ID
            SqlParameter outputParam = new SqlParameter("@NewUserID", System.Data.SqlDbType.Int);
            outputParam.Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.Add(outputParam);

            return cmd;
        }

        ////////////////// Method to create a new user using UserDto/////////////////

        ////////////////// Method to get all users/////////////////
        public List<User> GetAllUsers()
        {
            SqlConnection? con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            try
            {
                con = connect();
                con.Open();
                cmd = new SqlCommand("SELECT Id, Username, PasswordHash, Email, FavoriteAnimal, FavoriteDriverId, FavoriteTeamId, FavoriteRacingSpotId FROM Users", con);

                reader = cmd.ExecuteReader();
                List<User> users = new List<User>();

                while (reader.Read())
                {
                    users.Add(new User
                    {
                        Id = (int)reader["Id"],
                        Username = reader["Username"]?.ToString() ?? string.Empty,
                        PasswordHash = reader["PasswordHash"]?.ToString() ?? string.Empty,
                        Email = reader["Email"]?.ToString() ?? string.Empty,
                        FavoriteAnimal = reader["FavoriteAnimal"]?.ToString() ?? string.Empty,
                        FavoriteDriverId = reader["FavoriteDriverId"] != DBNull.Value ? (int)reader["FavoriteDriverId"] : 0,
                        FavoriteTeamId = reader["FavoriteTeamId"] != DBNull.Value ? (int)reader["FavoriteTeamId"] : 0,
                        FavoriteRacingSpotId = reader["FavoriteRacingSpotId"] != DBNull.Value ? (int)reader["FavoriteRacingSpotId"] : 0
                    });
                }
                return users;
            }
            catch (SqlException sqlEx)
            {
                Console.WriteLine($"SQL Exception: {sqlEx.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                throw;
            }
            finally
            {
                con?.Close();
            }
        }

        // Method to get a user by Id
        public User? GetUserById(int userId)
        {
            SqlConnection? con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            try
            {
                con = connect();
                con.Open();
                cmd = new SqlCommand(@"
                    SELECT 
                        Id, 
                        Username, 
                        PasswordHash, 
                        Email, 
                        FavoriteAnimal,
                        ProfilePhoto
                    FROM Users
                    WHERE Id = @Id", con);
                cmd.Parameters.AddWithValue("@Id", userId);

                reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    string? profilePhoto = reader.IsDBNull(5) ? null : reader.GetString(5);

                    // If profile photo exists but doesn't have the data:image prefix, add it
                    if (!string.IsNullOrEmpty(profilePhoto) && !profilePhoto.StartsWith("data:image"))
                    {
                        profilePhoto = $"data:image/jpeg;base64,{profilePhoto}";
                    }

                    return new User
                    {
                        Id = reader.GetInt32(0),
                        Username = reader.GetString(1),
                        PasswordHash = reader.GetString(2),
                        Email = reader.GetString(3),
                        FavoriteAnimal = reader.IsDBNull(4) ? string.Empty : reader.GetString(4),
                        ProfilePhoto = profilePhoto
                    };
                }
                return null;
            }
            catch (SqlException sqlEx)
            {
                Console.WriteLine($"SQL Exception: {sqlEx.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                throw;
            }
            finally
            {
                con?.Close();
            }
        }

        ////////////////// Method to get all users/////////////////


        ////////////////// Method to delete users/////////////////
        public bool DeleteUser(int id)
        {
            SqlConnection? con = null;
            SqlCommand cmd;

            try
            {
                Console.WriteLine($"Attempting to delete user with ID: {id}");
                con = connect();
                con.Open();

                // Call SP_DeleteUser stored procedure
                cmd = new SqlCommand("SP_DeleteUser", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserID", id);

                var result = cmd.ExecuteNonQuery();
                Console.WriteLine($"Delete operation affected {result} rows");
                return result > 0;
            }
            catch (SqlException sqlEx)
            {
                Console.WriteLine($"SQL Exception in DeleteUser: {sqlEx.Message}");
                Console.WriteLine($"SQL Error Number: {sqlEx.Number}");
                if (sqlEx.Number == 51000) // Our custom error number for "User not found"
                {
                    return false;
                }
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"General Exception in DeleteUser: {ex.Message}");
                throw;
            }
            finally
            {
                con?.Close();
            }
        }
        ////////////////// Method to delete users/////////////////
        

        ///// Method to update a user in the database///////////
        public bool UpdateUser(int userId, UserDto userDto)
        {
            SqlConnection? con = null;
            SqlCommand cmd;

            try
            {
                con = connect();
                con.Open();

                // SQL command to update user details
                cmd = new SqlCommand("UPDATE Users SET Username = @Username, PasswordHash = @PasswordHash, Email = @Email WHERE Id = @Id", con);
                cmd.Parameters.AddWithValue("@Id", userId);
                cmd.Parameters.AddWithValue("@Username", userDto.Username);
                cmd.Parameters.AddWithValue("@PasswordHash", userDto.PasswordHash); // Assuming password is already hashed
                cmd.Parameters.AddWithValue("@Email", userDto.Email);

                int rowsAffected = cmd.ExecuteNonQuery();

                return rowsAffected > 0; // If rows were affected, return true indicating successful update
            }
            catch (SqlException sqlEx)
            {
                Console.WriteLine($"SQL Exception: {sqlEx.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                throw;
            }
            finally
            {
                con?.Close();
            }
        }

        ///// Method to update user preferences///////////
        public bool UpdateUserPreferences(int userId, User user)
        {
            SqlConnection? con = null;
            SqlCommand cmd;

            try
            {
                con = connect();
                con.Open();

                // Direct SQL update statement with proper parameter name
                string updateSql = @"
                    UPDATE Users 
                    SET FavoriteDriverId = @FavoriteDriverId,
                        FavoriteTeamId = @FavoriteTeamId,
                        FavoriteRacingSpotId = @FavoriteRacingSpotId
                    WHERE Id = @Id";

                cmd = new SqlCommand(updateSql, con);
                
                // Add parameters with correct names
                cmd.Parameters.AddWithValue("@Id", userId);
                cmd.Parameters.AddWithValue("@FavoriteDriverId", 
                    user.FavoriteDriverId.HasValue ? (object)user.FavoriteDriverId.Value : DBNull.Value);
                cmd.Parameters.AddWithValue("@FavoriteTeamId", 
                    user.FavoriteTeamId.HasValue ? (object)user.FavoriteTeamId.Value : DBNull.Value);
                cmd.Parameters.AddWithValue("@FavoriteRacingSpotId", 
                    user.FavoriteRacingSpotId.HasValue ? (object)user.FavoriteRacingSpotId.Value : DBNull.Value);

                int result = cmd.ExecuteNonQuery();
                Console.WriteLine($"UpdateUserPreferences: {result} rows affected");

                return result > 0;
            }
            catch (SqlException sqlEx)
            {
                Console.WriteLine($"SQL Exception in UpdateUserPreferences: {sqlEx.Message}");
                Console.WriteLine($"Error Number: {sqlEx.Number}");
                Console.WriteLine($"Error State: {sqlEx.State}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in UpdateUserPreferences: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw;
            }
            finally
            {
                con?.Close();
            }
        }

        ///// Method to update user preferences///////////
        
        // Method to check if username exists
        public bool IsUsernameExists(string username)
        {
            SqlConnection? con = null;
            SqlCommand cmd;

            try
            {
                con = connect();
                con.Open();

                cmd = new SqlCommand("SELECT COUNT(1) FROM Users WHERE Username = @Username", con);
                cmd.Parameters.AddWithValue("@Username", username);

                int count = (int)cmd.ExecuteScalar();
                return count > 0;
            }
            catch (SqlException sqlEx)
            {
                Console.WriteLine($"SQL Exception: {sqlEx.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                throw;
            }
            finally
            {
                con?.Close();
            }
        }

        // Method to get a user by username
        public User? GetUserByUsername(string username)
        {
            SqlConnection? con = null;
            try
            {
                con = connect();
                con.Open();
                SqlCommand cmd = new SqlCommand(@"
                    SELECT 
                        Id, 
                        Username, 
                        PasswordHash, 
                        Email, 
                        FavoriteAnimal,
                        ProfilePhoto
                    FROM Users
                    WHERE Username = @Username", con);
                
                cmd.Parameters.AddWithValue("@Username", username);
                
                SqlDataReader dr = cmd.ExecuteReader();
                
                if (dr.Read())
                {
                    string? profilePhoto = dr.IsDBNull(5) ? null : dr.GetString(5);

                    return new User
                    {
                        Id = dr.GetInt32(0),
                        Username = dr.GetString(1),
                        PasswordHash = dr.GetString(2),
                        Email = dr.GetString(3),
                        FavoriteAnimal = dr.IsDBNull(4) ? string.Empty : dr.GetString(4),
                        ProfilePhoto = profilePhoto
                    };
                }
                return null;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        // Method to get favorite drivers for a user
        public async Task<List<int>> GetFavoriteDrivers(int userId)
        {
            var favoriteDrivers = new List<int>();
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("GetFavoriteDrivers", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@UserId", userId);

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                favoriteDrivers.Add(reader.GetInt32(0));
            }

            return favoriteDrivers;
        }

        // Method to get favorite teams for a user
        public async Task<List<int>> GetFavoriteTeams(int userId)
        {
            var favoriteTeams = new List<int>();
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("GetFavoriteTeams", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@UserId", userId);

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                favoriteTeams.Add(reader.GetInt32(0));
            }

            return favoriteTeams;
        }

        // Method to set favorite driver
        public async Task<bool> SetFavoriteDriver(int userId, int driverId)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("SetFavoriteDriver", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@UserId", userId);
            command.Parameters.AddWithValue("@DriverId", driverId);

            try
            {
                await command.ExecuteNonQueryAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error setting favorite driver: {ex.Message}");
                return false;
            }
        }

        // Method to set favorite team
        public async Task<bool> SetFavoriteTeam(int userId, int teamId)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("SetFavoriteTeam", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@UserId", userId);
            command.Parameters.AddWithValue("@TeamId", teamId);

            try
            {
                await command.ExecuteNonQueryAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error setting favorite team: {ex.Message}");
                return false;
            }
        }

        // Method to get all user favorites
        public async Task<UserFavorites> GetUserFavorites(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            try
            {
                await connection.OpenAsync();

                using var command = new SqlCommand("GetUserFavorites", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@UserId", userId);

                var favorites = new UserFavorites
                {
                    Drivers = new List<FavoriteDriver>(),
                    Teams = new List<FavoriteTeam>(),
                    RacingSpots = new List<string>()
                };

                Console.WriteLine("Executing stored procedure...");
                using var reader = await command.ExecuteReaderAsync();
                
                while (await reader.ReadAsync())
                {
                    try
                    {
                        var driver = new FavoriteDriver
                        {
                            DriverId = reader.GetInt32(reader.GetOrdinal("DriverId")),
                            DriverName = reader.GetString(reader.GetOrdinal("DriverName")),
                            PhotoURL = !reader.IsDBNull(reader.GetOrdinal("PhotoURL")) ? 
                                      reader.GetString(reader.GetOrdinal("PhotoURL")) : string.Empty,
                            TeamId = !reader.IsDBNull(reader.GetOrdinal("TeamId")) ? 
                                    reader.GetInt32(reader.GetOrdinal("TeamId")) : 0,
                            AcronymName = !reader.IsDBNull(reader.GetOrdinal("AcronymName")) ? 
                                         reader.GetString(reader.GetOrdinal("AcronymName")) : string.Empty,
                            TeamName = !reader.IsDBNull(reader.GetOrdinal("TeamName")) ? 
                                      reader.GetString(reader.GetOrdinal("TeamName")) : string.Empty,
                            TeamColor = !reader.IsDBNull(reader.GetOrdinal("TeamColor")) ? 
                                       reader.GetString(reader.GetOrdinal("TeamColor")) : string.Empty
                        };
                        favorites.Drivers.Add(driver);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error reading driver data: {ex.Message}");
                        Console.WriteLine($"Stack trace: {ex.StackTrace}");
                    }
                }

                // Move to next result set (teams with details)
                if (!await reader.NextResultAsync())
                {
                    Console.WriteLine("Failed to move to teams result set");
                    throw new Exception("Failed to read teams data - could not move to next result set");
                }

                while (await reader.ReadAsync())
                {
                    try
                    {
                        var team = new FavoriteTeam
                        {
                            TeamId = reader.GetInt32(reader.GetOrdinal("TeamId")),
                            TeamName = !reader.IsDBNull(reader.GetOrdinal("TeamName")) ? 
                                      reader.GetString(reader.GetOrdinal("TeamName")) : string.Empty,
                            Color = !reader.IsDBNull(reader.GetOrdinal("Color")) ? 
                                   reader.GetString(reader.GetOrdinal("Color")) : string.Empty
                        };
                        favorites.Teams.Add(team);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error reading team data: {ex.Message}");
                        Console.WriteLine($"Stack trace: {ex.StackTrace}");
                    }
                }

                // Move to next result set (racing spots)
                if (!await reader.NextResultAsync())
                {
                    Console.WriteLine("Failed to move to racing spots result set");
                    throw new Exception("Failed to read racing spots data - could not move to next result set");
                }

                while (await reader.ReadAsync())
                {
                    try
                    {
                        if (!reader.IsDBNull(0))
                        {
                            favorites.RacingSpots.Add(reader.GetString(0));
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error reading racing spot data: {ex.Message}");
                        Console.WriteLine($"Stack trace: {ex.StackTrace}");
                    }
                }

                return favorites;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetUserFavorites: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        // Implement the connection logic, now using the connection string from IConfiguration
        private SqlConnection connect()
        {
            return new SqlConnection(_connectionString);
        }

        public bool UpdateProfilePhoto(int userId, string? profilePhoto)
        {
            SqlConnection? con = null;
            try
            {
                con = connect();
                con.Open();

                SqlCommand cmd = new SqlCommand("SP_UpdateProfilePhoto", con);
                cmd.CommandType = CommandType.StoredProcedure;
                
                cmd.Parameters.AddWithValue("@UserId", userId);
                cmd.Parameters.AddWithValue("@ProfilePhoto", profilePhoto != null ? (object)profilePhoto : DBNull.Value);

                using var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    var updatedPhoto = reader.IsDBNull(0) ? null : reader.GetString(0);
                    Console.WriteLine($"Profile photo updated. New photo exists: {updatedPhoto != null}");
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating profile photo: {ex.Message}");
                throw;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public bool saveProfilePhoto(int userId, string profilePhoto)
        {
            SqlConnection? con = null;
            try
            {
                con = connect();
                con.Open();

                SqlCommand cmd = new SqlCommand("SP_UpdateProfilePhoto", con);
                cmd.CommandType = CommandType.StoredProcedure;
                
                cmd.Parameters.AddWithValue("@UserId", userId);
                cmd.Parameters.AddWithValue("@ProfilePhoto", profilePhoto != null ? (object)profilePhoto : DBNull.Value);

                using var reader = cmd.ExecuteReader();
                return reader.HasRows;
            }
            finally
            {
                con?.Close();
            }
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(@"
                    SELECT 
                        Username,
                        PasswordHash,
                        Email,
                        FavoriteAnimal,
                        ProfilePhoto,
                        Id
                    FROM Users 
                    WHERE Email = @Email", connection))
                {
                    command.Parameters.AddWithValue("@Email", email);
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new User
                            {
                                Username = reader.GetString(0),
                                PasswordHash = reader.GetString(1),
                                Email = reader.GetString(2),
                                FavoriteAnimal = reader.IsDBNull(3) ? string.Empty : reader.GetString(3),
                                ProfilePhoto = reader.IsDBNull(4) ? null : reader.GetString(4),
                                Id = reader.GetInt32(5)
                            };
                        }
                    }
                }
            }
            return null;
        }

        public async Task<User> CreateUser(User user)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand("SP_AddNewUser", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    
                    command.Parameters.AddWithValue("@Username", user.Username);
                    command.Parameters.AddWithValue("@PasswordHash", user.PasswordHash);
                    command.Parameters.AddWithValue("@Email", user.Email);
                    command.Parameters.AddWithValue("@FavoriteAnimal", user.FavoriteAnimal ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@ProfilePhoto", user.ProfilePhoto ?? (object)DBNull.Value);

                    // Output parameter for the new user ID
                    var outputParam = new SqlParameter("@NewUserID", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    command.Parameters.Add(outputParam);

                    // Execute and read the result
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            // Skip SequentialID (index 0)
                            user.Id = reader.GetInt32(1); // Id is now at index 1
                            user.Username = reader.GetString(2);
                            user.PasswordHash = reader.GetString(3);
                            user.Email = reader.GetString(4);
                            user.FavoriteAnimal = reader.IsDBNull(5) ? string.Empty : reader.GetString(5);
                            user.ProfilePhoto = reader.IsDBNull(6) ? null : reader.GetString(6);
                            // GoogleUid at index 7 is not used in the User model
                        }
                    }
                }
            }
            return user;
        }

        public async Task<bool> UpdateUser(User user)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand("UPDATE Users SET Username = @Username, Email = @Email, FavoriteAnimal = @FavoriteAnimal, ProfilePhoto = @ProfilePhoto WHERE Id = @Id", connection))
                {
                    command.Parameters.AddWithValue("@Id", user.Id);
                    command.Parameters.AddWithValue("@Username", user.Username);
                    command.Parameters.AddWithValue("@Email", user.Email);
                    command.Parameters.AddWithValue("@FavoriteAnimal", user.FavoriteAnimal ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@ProfilePhoto", user.ProfilePhoto ?? (object)DBNull.Value);

                    int rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
        }
    }
}
