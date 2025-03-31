using Microsoft.AspNetCore.Mvc;
using server.DAL;
using server.Models;
using BCrypt.Net;
using Microsoft.Extensions.Logging;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserDAL _userDAL;
        private readonly ILogger<UserController> _logger;

        public UserController(IConfiguration configuration, ILogger<UserController> logger)
        {
            _userDAL = new UserDAL(configuration);
            _logger = logger;
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
                var user = _userDAL.GetUserByUsername(userInput.Username);
                if (user == null)
                {
                    return Unauthorized("Invalid username or password.");
                }

                bool isValidPassword = BCrypt.Net.BCrypt.Verify(userInput.Password, user.PasswordHash);
                if (!isValidPassword)
                {
                    return Unauthorized("Invalid username or password.");
                }

                // Get the profile photo
                string? profilePhoto = user.ProfilePhoto;
                if (!string.IsNullOrEmpty(profilePhoto) && !profilePhoto.StartsWith("data:image"))
                {
                    profilePhoto = $"data:image/jpeg;base64,{profilePhoto}";
                }

                var response = new { 
                    Message = "Login successful.",
                    UserId = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    FavoriteAnimal = user.FavoriteAnimal,
                    Profile = new {
                        FavoriteAnimal = user.FavoriteAnimal,
                        ProfilePhoto = profilePhoto
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Login failed: {ex.Message}" });
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

        [HttpPost("{id}/profile-photo")]
        public IActionResult UpdateProfilePhoto(int id, [FromBody] ProfilePhotoUpdate photoUpdate)
        {
            try
            {
                if (photoUpdate == null || string.IsNullOrEmpty(photoUpdate.ProfilePhoto))
                {
                    return BadRequest(new { Message = "Photo data is required." });
                }

                var existingUser = _userDAL.GetUserById(id);
                if (existingUser == null)
                {
                    return NotFound(new { Message = $"User with Id {id} not found." });
                }

                // Extract base64 data if it has a prefix
                string photoData = photoUpdate.ProfilePhoto;
                if (photoData.Contains(","))
                {
                    var parts = photoData.Split(',');
                    photoData = parts[1];
                }

                bool updateSuccess = _userDAL.saveProfilePhoto(id, photoData);

                if (!updateSuccess)
                {
                    return StatusCode(500, new { Message = "Failed to update profile photo." });
                }

                // Get the updated user data
                var updatedUser = _userDAL.GetUserById(id);
                
                return Ok(new { 
                    Message = "Profile photo updated successfully",
                    User = new {
                        Id = updatedUser.Id,
                        Username = updatedUser.Username,
                        Profile = new {
                            ProfilePhoto = updatedUser.ProfilePhoto,
                            FavoriteAnimal = updatedUser.FavoriteAnimal
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Failed to update profile photo: {ex.Message}" });
            }
        }

        [HttpGet("{id}/profile-photo")]
        public IActionResult GetProfilePhoto(int id)
        {
            try
            {
                var user = _userDAL.GetUserById(id);
                if (user == null)
                {
                    return NotFound(new { Message = $"User with Id {id} not found." });
                }

                if (string.IsNullOrEmpty(user.ProfilePhoto))
                {
                    return NotFound(new { Message = "No profile photo found for this user." });
                }

                // Ensure the photo has the correct prefix
                string photoData = user.ProfilePhoto;
                if (!photoData.StartsWith("data:image"))
                {
                    photoData = $"data:image/jpeg;base64,{photoData}";
                }

                return Ok(new { 
                    profilePhoto = photoData 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Failed to retrieve profile photo: {ex.Message}" });
            }
        }

        public class GoogleLoginRequest
        {
            public string Uid { get; set; }
            public string Email { get; set; }
            public string DisplayName { get; set; }
            public string PhotoURL { get; set; }
        }

        [HttpPost("google-login")]
        public IActionResult GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            try
            {
                _logger.LogInformation($"Attempting Google login for user with email: {request.Email}");

                // Try to get existing user by Google UID
                var user = _userDAL.GetUserByGoogleUid(request.Uid);

                if (user == null)
                {
                    // Create new user if doesn't exist
                    var newUser = new User
                    {
                        Username = request.DisplayName ?? request.Email.Split('@')[0],
                        Email = request.Email,
                        GoogleUid = request.Uid,
                        ProfilePhoto = request.PhotoURL
                    };

                    var userId = _userDAL.CreateGoogleUser(newUser);
                    user = _userDAL.GetUserById(userId);
                }

                if (user == null)
                {
                    return BadRequest(new { message = "Failed to create or retrieve user" });
                }

                return Ok(new
                {
                    userId = user.Id,
                    username = user.Username,
                    email = user.Email,
                    favoriteAnimal = user.FavoriteAnimal,
                    favoriteDriverId = user.FavoriteDriverId,
                    favoriteTeamId = user.FavoriteTeamId,
                    profilePhoto = user.ProfilePhoto
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in Google login: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error during Google login" });
            }
        }
    }

    public class ProfilePhotoUpdate
    {
        public string? ProfilePhoto { get; set; }
    }
}
