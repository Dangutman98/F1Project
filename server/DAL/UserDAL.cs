﻿using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using server.Models;
using System.Data;

namespace server.DAL
{
    public class UserDAL
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public UserDAL(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("igroup179_prod");
        }


        // Method to check if a user exists based on username and password hash
        public bool CheckUserCredentials(string username, string passwordHash)
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

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
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect(); // Create the connection
                con.Open(); // Ensure the connection is open
                Console.WriteLine("Database connection opened successfully");

                cmd = BuildAddNewUserToDBCommand(con, userDto); // Create the command
                Console.WriteLine("Command built successfully");

                cmd.ExecuteNonQuery(); // Execute stored procedure
                Console.WriteLine("Stored procedure executed successfully");

                // Retrieve the new user ID from the output parameter
                int userID = Convert.ToInt32(cmd.Parameters["@NewUserID"].Value);
                Console.WriteLine($"New user created with ID: {userID}");
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
            SqlConnection con = null;
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
                        Username = reader["Username"].ToString(),
                        PasswordHash = reader["PasswordHash"].ToString(),
                        Email = reader["Email"].ToString(),
                        FavoriteAnimal = reader["FavoriteAnimal"]?.ToString(),
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
        public User GetUserById(int userId)
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            try
            {
                con = connect();
                con.Open();
                cmd = new SqlCommand(@"
                    SELECT 
                        u.Id, 
                        u.Username, 
                        u.PasswordHash, 
                        u.Email, 
                        u.FavoriteAnimal,
                        p.ProfilePhoto
                    FROM Users u
                    LEFT JOIN Profile p ON u.Id = p.UserId
                    WHERE u.Id = @Id", con);
                cmd.Parameters.AddWithValue("@Id", userId);

                reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    string? profilePhoto = reader["ProfilePhoto"] != DBNull.Value ? reader["ProfilePhoto"].ToString() : null;
                    
                    // If profile photo exists but doesn't have the data:image prefix, add it
                    if (!string.IsNullOrEmpty(profilePhoto) && !profilePhoto.StartsWith("data:image"))
                    {
                        profilePhoto = $"data:image/jpeg;base64,{profilePhoto}";
                    }

                    return new User
                    {
                        Id = (int)reader["Id"],
                        Username = reader["Username"].ToString(),
                        PasswordHash = reader["PasswordHash"].ToString(),
                        Email = reader["Email"].ToString(),
                        FavoriteAnimal = reader["FavoriteAnimal"]?.ToString(),
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
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect();
                con.Open();
                Console.WriteLine("Database connection opened successfully");

                // First check if user exists
                cmd = new SqlCommand("SELECT COUNT(1) FROM Users WHERE Id = @UserID", con);
                cmd.Parameters.AddWithValue("@UserID", id);
                int count = (int)cmd.ExecuteScalar();

                if (count == 0)
                {
                    Console.WriteLine($"User with ID {id} not found");
                    return false;
                }

                // If user exists, proceed with deletion and reordering
                cmd = new SqlCommand("SP_DeleteUser", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserID", id);

                cmd.ExecuteNonQuery();
                Console.WriteLine($"User with ID {id} deleted and IDs reordered successfully");
                return true;
            }
            catch (SqlException sqlEx)
            {
                Console.WriteLine($"SQL Exception in DeleteUser: {sqlEx.Message}");
                Console.WriteLine($"Error Number: {sqlEx.Number}");
                Console.WriteLine($"Error State: {sqlEx.State}");
                Console.WriteLine($"Procedure: {sqlEx.Procedure}");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in DeleteUser: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return false;
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
            SqlConnection con = null;
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
            SqlConnection con = null;
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
            SqlConnection con = null;
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
            SqlConnection con = null;
            try
            {
                con = connect();
                con.Open();
                SqlCommand cmd = new SqlCommand(@"
                    SELECT 
                        u.Id, 
                        u.Username, 
                        u.PasswordHash, 
                        u.Email, 
                        u.FavoriteAnimal,
                        p.ProfilePhoto
                    FROM Users u
                    LEFT JOIN Profile p ON u.Id = p.UserId
                    WHERE u.Username = @Username", con);
                
                cmd.Parameters.AddWithValue("@Username", username);
                
                SqlDataReader dr = cmd.ExecuteReader();
                
                if (dr.Read())
                {
                    return new User
                    {
                        Id = dr.GetInt32(0),
                        Username = dr.GetString(1),
                        PasswordHash = dr.GetString(2),
                        Email = dr.GetString(3),
                        FavoriteAnimal = dr.GetString(4),
                        ProfilePhoto = !dr.IsDBNull(5) ? dr.GetString(5) : null
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
                Console.WriteLine($"Database connection opened for user {userId}");

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
                
                Console.WriteLine("Reading favorite drivers...");
                // Read favorite drivers with details
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

                Console.WriteLine($"Found {favorites.Drivers.Count} favorite drivers");

                Console.WriteLine("Moving to teams result set...");
                // Move to next result set (teams with details)
                if (!await reader.NextResultAsync())
                {
                    Console.WriteLine("Failed to move to teams result set");
                    throw new Exception("Failed to read teams data - could not move to next result set");
                }

                Console.WriteLine("Reading favorite teams...");
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

                Console.WriteLine($"Found {favorites.Teams.Count} favorite teams");

                Console.WriteLine("Moving to racing spots result set...");
                // Move to next result set (racing spots)
                if (!await reader.NextResultAsync())
                {
                    Console.WriteLine("Failed to move to racing spots result set");
                    throw new Exception("Failed to read racing spots data - could not move to next result set");
                }

                Console.WriteLine("Reading favorite racing spots...");
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

                Console.WriteLine($"Found {favorites.RacingSpots.Count} favorite racing spots");
                Console.WriteLine("Successfully retrieved all favorites");
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
            SqlConnection con = null;
            try
            {
                con = connect();
                con.Open();
                Console.WriteLine($"Opening database connection for user {userId}");

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

        public Profile GetUserProfile(int userId)
        {
            SqlConnection con = null;
            try
            {
                con = connect();
                con.Open();
                Console.WriteLine($"Getting profile for user {userId}");
                
                SqlCommand cmd = new SqlCommand("SP_GetUserProfile", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", userId);
                
                using var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    var profile = new Profile
                    {
                        UserId = userId,
                        ProfilePhoto = !reader.IsDBNull(4) ? reader.GetString(4) : null
                    };
                    
                    // If profile photo exists but doesn't have prefix, add it
                    if (!string.IsNullOrEmpty(profile.ProfilePhoto) && !profile.ProfilePhoto.StartsWith("data:image"))
                    {
                        profile.ProfilePhoto = $"data:image/jpeg;base64,{profile.ProfilePhoto}";
                    }
                    
                    Console.WriteLine($"Found profile for user {userId}. Has photo: {profile.ProfilePhoto != null}");
                    return profile;
                }
                
                Console.WriteLine($"No profile found for user {userId}");
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting profile for user {userId}: {ex.Message}");
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
    }
}
