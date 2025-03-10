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

        public UserDAL(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("F1ProjectDb");
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
                cmd = new SqlCommand("SELECT Id, Username, PasswordHash, Email, FavoriteAnimal, FavoriteDriverId, FavoriteTeamId, FavoriteRacingSpotId FROM Users WHERE Id = @Id", con);
                cmd.Parameters.AddWithValue("@Id", userId);

                reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    return new User
                    {
                        Id = (int)reader["Id"],
                        Username = reader["Username"].ToString(),
                        PasswordHash = reader["PasswordHash"].ToString(),
                        Email = reader["Email"].ToString(),
                        FavoriteAnimal = reader["FavoriteAnimal"]?.ToString(),
                        FavoriteDriverId = reader["FavoriteDriverId"] != DBNull.Value ? (int)reader["FavoriteDriverId"] : 0,
                        FavoriteTeamId = reader["FavoriteTeamId"] != DBNull.Value ? (int)reader["FavoriteTeamId"] : 0,
                        FavoriteRacingSpotId = reader["FavoriteRacingSpotId"] != DBNull.Value ? (int)reader["FavoriteRacingSpotId"] : 0
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
        public User GetUserByUsername(string username)
        {
            SqlConnection con = null;
            SqlCommand cmd;
            SqlDataReader reader;

            try
            {
                // Console.WriteLine($"GetUserByUsername: Attempting to find user with username: {username}");
                con = connect();
                con.Open();
                // Console.WriteLine("GetUserByUsername: Database connection opened successfully");

                cmd = new SqlCommand("SELECT Id, Username, PasswordHash, Email, FavoriteAnimal FROM Users WHERE Username = @Username", con);
                cmd.Parameters.AddWithValue("@Username", username);
                // Console.WriteLine($"GetUserByUsername: Executing query for username: {username}");

                reader = cmd.ExecuteReader();
                // Console.WriteLine("GetUserByUsername: Query executed successfully");

                if (reader.Read())
                {
                    // Console.WriteLine("GetUserByUsername: User found in database");
                    var user = new User
                    {
                        Id = (int)reader["Id"],
                        Username = reader["Username"].ToString(),
                        PasswordHash = reader["PasswordHash"].ToString(),
                        Email = reader["Email"].ToString(),
                        FavoriteAnimal = reader["FavoriteAnimal"]?.ToString()
                    };
                    // Console.WriteLine($"GetUserByUsername: User details - ID: {user.Id}, Username: {user.Username}, Hash Length: {user.PasswordHash?.Length ?? 0}");
                    return user;
                }
                // Console.WriteLine("GetUserByUsername: No user found with the specified username");
                return null;
            }
            catch (SqlException sqlEx)
            {
                // Console.WriteLine($"SQL Exception in GetUserByUsername: {sqlEx.Message}");
                // Console.WriteLine($"Error Number: {sqlEx.Number}");
                // Console.WriteLine($"Error State: {sqlEx.State}");
                throw;
            }
            catch (Exception ex)
            {
                // Console.WriteLine($"Exception in GetUserByUsername: {ex.Message}");
                // Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw;
            }
            finally
            {
                con?.Close();
            }
        }

        // Implement the connection logic, now using the connection string from IConfiguration
        private SqlConnection connect()
        {
            return new SqlConnection(_connectionString);
        }
    }
}
