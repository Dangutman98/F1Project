using Microsoft.AspNetCore.Mvc;
using server.DAL;
using server.Models;
using BCrypt.Net;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
       

        private readonly UserDAL _userDAL;

        public UserController(IConfiguration configuration)
        {
            _userDAL = new UserDAL(configuration);
        }

        public class UserInput
        {
            public required string Username { get; set; }
            public required string Password { get; set; }
        }

        // Get user by id
        [HttpGet("{id}")]
        public IActionResult GetUserById(int id)
        {
            var user = _userDAL.GetUserById(id);

            if (user == null)
            {
                return NotFound($"User with Id {id} not found.");
            }

            return Ok(user);
        }

        [HttpGet("{id}/favorites")]
        public async Task<ActionResult<UserFavorites>> GetUserFavorites(int id)
        {
            try
            {
                Console.WriteLine($"Getting favorites for user {id}");
                var favorites = await _userDAL.GetUserFavorites(id);
                Console.WriteLine($"Successfully retrieved favorites for user {id}");
                return Ok(favorites);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving user favorites: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { Message = $"Error retrieving user favorites: {ex.Message}" });
            }
        }

        // POST api/<UserController>
        /// <summary>
        /// Creates a new user.
        /// </summary>
        /// <param name="username" name="passwordHash">The user to create.</param>
        /// using userDto.cs file in models to add only username,password,email when new user created.
        [HttpPost]
        public IActionResult Post([FromBody] UserDto userDto)
        {
            if (userDto == null)
            {
                return BadRequest("Invalid user data.");
            }

            // Validate password requirements
            if (string.IsNullOrEmpty(userDto.PasswordHash))
            {
                return BadRequest("Password is required.");
            }

            if (userDto.PasswordHash.Length < 7 || 
                !userDto.PasswordHash.Any(char.IsUpper) || 
                !userDto.PasswordHash.Any(char.IsLower) || 
                !userDto.PasswordHash.Any(char.IsDigit))
            {
                return BadRequest("Must contain at least 7 characters with one uppercase letter, one lowercase letter, and one number");
            }

            // Hash the password before saving
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.PasswordHash);
            userDto.PasswordHash = hashedPassword;

            Console.WriteLine($"Username = {userDto.Username}");
            Console.WriteLine($"Email = {userDto.Email}");
            Console.WriteLine($"FavoriteAnimal = {userDto.FavoriteAnimal}");

            try
            {
                int newUserId = _userDAL.AddNewUserToDB(userDto);

                if (newUserId == -1)
                {
                    return Conflict("Username already exists. Please choose a different username.");
                }

                if (newUserId <= 0)
                {
                    Console.WriteLine("Failed to create user - newUserId is 0 or negative");
                    return StatusCode(500, "Failed to create user. Please try again.");
                }

                return Ok(new { 
                    Message = "User created successfully", 
                    UserId = newUserId,
                    Username = userDto.Username,
                    Email = userDto.Email,
                    FavoriteAnimal = userDto.FavoriteAnimal
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating user: {ex.Message}");
                return StatusCode(500, "Failed to create user. Please try again.");
            }
        }

        // POST /api/user/login - Check if user exists in the database
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserInput userInput)
        {
            if (userInput == null || string.IsNullOrEmpty(userInput.Username) || string.IsNullOrEmpty(userInput.Password))
            {
                return BadRequest("Invalid login credentials.");
            }

            try
            {
                // Console.WriteLine($"Attempting login for username: {userInput.Username}");
                
                // Get the user's stored hash
                var user = _userDAL.GetUserByUsername(userInput.Username);
                if (user == null)
                {
                    // Console.WriteLine($"User not found: {userInput.Username}");
                    return Unauthorized("Invalid username or password.");
                }

                // Console.WriteLine($"User found. Stored hash length: {user.PasswordHash?.Length ?? 0}");
                // Console.WriteLine($"Attempting to verify password...");

                // Verify the password
                bool isValidPassword = BCrypt.Net.BCrypt.Verify(userInput.Password, user.PasswordHash);
                // Console.WriteLine($"Password verification result: {isValidPassword}");

                if (!isValidPassword)
                {
                    // Console.WriteLine("Password verification failed");
                    return Unauthorized("Invalid username or password.");
                }

                // Console.WriteLine("Login successful, preparing response");
                try {
                    var response = new { 
                        Message = "Login successful.",
                        UserId = user.Id,
                        Username = user.Username,
                        Email = user.Email,
                        FavoriteAnimal = user.FavoriteAnimal,
                        FavoriteDriverId = user.FavoriteDriverId,
                        FavoriteTeamId = user.FavoriteTeamId
                    };
                    return Ok(response);
                }
                catch (Exception) {
                    // Console.WriteLine($"Error creating or serializing response: {ex.Message}");
                    // Console.WriteLine($"Stack trace: {ex.StackTrace}");
                    return StatusCode(500, "Internal server error during response creation");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, new { Message = "Login failed. Please try again." });
            }
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] UserDto userDto)
        {
            if (userDto == null)
            {
                return BadRequest("Invalid user data.");
            }

            var existingUser = _userDAL.GetUserById(id);
            if (existingUser == null)
            {
                return NotFound($"User with Id {id} not found.");
            }

            // Update user in the database
            bool updateSuccess = _userDAL.UpdateUser(id, userDto);

            if (!updateSuccess)
            {
                return StatusCode(500, "Failed to update user.");
            }

            return Ok(new { Message = "User updated successfully" });
        }

        // PUT api/<UserController>/5/preferences
        [HttpPut("{id}/preferences")]
        public IActionResult UpdatePreferences(int id, [FromBody] dynamic preferences)
        {
            try
            {
                var existingUser = _userDAL.GetUserById(id);
                if (existingUser == null)
                {
                    return NotFound(new { Message = $"User with Id {id} not found." });
                }

                // Extract values from dynamic object, allowing nulls
                int? favoriteDriverId = preferences.favoriteDriverId;
                int? favoriteTeamId = preferences.favoriteTeamId;
                int? favoriteRacingSpotId = preferences.favoriteRacingSpotId;

                Console.WriteLine($"Updating preferences for user {id}:");
                Console.WriteLine($"FavoriteDriverId: {favoriteDriverId}");
                Console.WriteLine($"FavoriteTeamId: {favoriteTeamId}");
                Console.WriteLine($"FavoriteRacingSpotId: {favoriteRacingSpotId}");

                // Update only the preference fields, allowing nulls
                existingUser.FavoriteDriverId = favoriteDriverId;
                existingUser.FavoriteTeamId = favoriteTeamId;
                existingUser.FavoriteRacingSpotId = favoriteRacingSpotId;

                // Update user preferences in the database
                bool updateSuccess = _userDAL.UpdateUserPreferences(id, existingUser);

                if (!updateSuccess)
                {
                    Console.WriteLine("Failed to update user preferences in database");
                    return StatusCode(500, new { Message = "Failed to update user preferences." });
                }

                return Ok(new { 
                    Message = "User preferences updated successfully",
                    Data = new {
                        FavoriteDriverId = existingUser.FavoriteDriverId,
                        FavoriteTeamId = existingUser.FavoriteTeamId,
                        FavoriteRacingSpotId = existingUser.FavoriteRacingSpotId
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating preferences: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { Message = $"Failed to update preferences: {ex.Message}" });
            }
        }

        // Delete user by id
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            bool isDeleted = _userDAL.DeleteUser(id);

            if (!isDeleted)
            {
                return NotFound($"User with Id {id} not found.");
            }

            return Ok(new { Message = "User deleted successfully" });
        }

        [HttpPost("{userId}/favorite/driver/{driverId}")]
        public async Task<ActionResult> SetFavoriteDriver(int userId, int driverId)
        {
            try
            {
                var result = await _userDAL.SetFavoriteDriver(userId, driverId);
                if (result)
                {
                    var favorites = await _userDAL.GetFavoriteDrivers(userId);
                    return Ok(new { Message = "Favorite driver updated successfully", FavoriteDrivers = favorites });
                }
                return BadRequest(new { Message = "Failed to update favorite driver" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error setting favorite driver: {ex.Message}" });
            }
        }

        [HttpPost("{userId}/favorite/team/{teamId}")]
        public async Task<ActionResult> SetFavoriteTeam(int userId, int teamId)
        {
            try
            {
                var result = await _userDAL.SetFavoriteTeam(userId, teamId);
                if (result)
                {
                    var favorites = await _userDAL.GetFavoriteTeams(userId);
                    return Ok(new { Message = "Favorite team updated successfully", FavoriteTeams = favorites });
                }
                return BadRequest(new { Message = "Failed to update favorite team" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error setting favorite team: {ex.Message}" });
            }
        }
    }
}
