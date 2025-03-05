using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using server.Models;

namespace server.DAL
{
    public class UserDAL
    {
        private readonly IConfiguration _configuration;

        public UserDAL(IConfiguration configuration)
        {
            _configuration = configuration;
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
                cmd = BuildAddNewUserToDBCommand(con, userDto); // Create the command

                cmd.ExecuteNonQuery(); // Execute stored procedure

                // Retrieve the new user ID from the output parameter
                int userID = Convert.ToInt32(cmd.Parameters["@NewUserID"].Value);
                return userID;
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

        // Build the SQL command for adding a new user
        private SqlCommand BuildAddNewUserToDBCommand(SqlConnection con, UserDto userDto)
        {
            SqlCommand cmd = new SqlCommand("SP_AddNewUser", con);
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Username", userDto.Username);
            cmd.Parameters.AddWithValue("@PasswordHash", userDto.PasswordHash);  // Assuming the password is already hashed
            cmd.Parameters.AddWithValue("@Email", userDto.Email);

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
        public bool DeleteUser(int userId)
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect();
                con.Open();
                cmd = new SqlCommand("DELETE FROM Users WHERE Id = @Id", con);
                cmd.Parameters.AddWithValue("@Id", userId);

                int rowsAffected = cmd.ExecuteNonQuery();

                return rowsAffected > 0; // If rows were affected, return true indicating successful deletion
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

                // SQL command to update user preferences
                cmd = new SqlCommand("UPDATE Users SET FavoriteAnimal = @FavoriteAnimal, FavoriteDriverId = @FavoriteDriverId, FavoriteTeamId = @FavoriteTeamId, FavoriteRacingSpotId = @FavoriteRacingSpotId WHERE Id = @Id", con);
                cmd.Parameters.AddWithValue("@Id", userId);
                cmd.Parameters.AddWithValue("@FavoriteAnimal", (object?)user.FavoriteAnimal ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FavoriteDriverId", (object?)user.FavoriteDriverId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FavoriteTeamId", (object?)user.FavoriteTeamId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FavoriteRacingSpotId", (object?)user.FavoriteRacingSpotId ?? DBNull.Value);

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
        
        // Implement the connection logic, now using the connection string from IConfiguration
        private SqlConnection connect()
        {
            var connectionString = _configuration.GetConnectionString("F1ProjectDb"); // Get the connection string by name
            return new SqlConnection(connectionString);
        }
    }
}
