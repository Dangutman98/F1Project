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
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
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
                var favorites = await _userDAL.GetUserFavorites(id);
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
            _logger.LogInformation("Attempting to delete user with ID: {UserId}", id);
            
            bool isDeleted = _userDAL.DeleteUser(id);

            if (!isDeleted)
            {
                _logger.LogWarning("User with ID {UserId} not found or could not be deleted", id);
                return NotFound($"User with Id {id} not found.");
            }

            _logger.LogInformation("User with ID {UserId} deleted successfully", id);
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

                // If no photo, return empty string without error
                if (string.IsNullOrEmpty(user.ProfilePhoto))
                {
                    return Ok(new { 
                        profilePhoto = "",
                        message = "No profile photo set"
                    });
                }

                // If it's already a valid URL (http/https) or has data:image prefix, return as is
                if (user.ProfilePhoto.StartsWith("http") || user.ProfilePhoto.StartsWith("data:image"))
                {
                    return Ok(new { 
                        profilePhoto = user.ProfilePhoto 
                    });
                }

                // For base64 data without prefix, add the prefix
                return Ok(new { 
                    profilePhoto = $"data:image/jpeg;base64,{user.ProfilePhoto}" 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving profile photo for user {UserId}", id);
                return StatusCode(500, new { Message = $"Failed to retrieve profile photo: {ex.Message}" });
            }
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            try
            {
                _logger.LogInformation("Attempting Google login for user: {Email}", request.Email);
                
                // Check if user exists
                var existingUser = await _userDAL.GetUserByEmail(request.Email);
                
                if (existingUser == null)
                {
                    // Create new user
                    var newUser = new User
                    {
                        Username = request.DisplayName ?? request.Email.Split('@')[0],
                        Email = request.Email,
                        ProfilePhoto = null, // Don't store Google photo URL in database
                        FavoriteAnimal = "Not Set",
                        PasswordHash = "GOOGLE_AUTH"
                    };

                    var createdUser = await _userDAL.CreateUser(newUser);
                    _logger.LogInformation("Created new user for Google login: {UserId}", createdUser.Id);
                    
                    return Ok(new
                    {
                        id = createdUser.Id,
                        username = createdUser.Username,
                        email = createdUser.Email,
                        favoriteAnimal = createdUser.FavoriteAnimal,
                        profilePhoto = request.PhotoURL // Return the Google photo URL but don't store it
                    });
                }
                else
                {
                    // Get the stored profile photo from database
                    string? storedProfilePhoto = existingUser.ProfilePhoto;
                    string? finalPhotoUrl = storedProfilePhoto;

                    // If there's a stored photo and it's base64, add the prefix
                    if (!string.IsNullOrEmpty(storedProfilePhoto) && !storedProfilePhoto.StartsWith("http") && !storedProfilePhoto.StartsWith("data:image"))
                    {
                        finalPhotoUrl = $"data:image/jpeg;base64,{storedProfilePhoto}";
                    }

                    // Only update Google photo if no stored photo exists
                    if (string.IsNullOrEmpty(storedProfilePhoto) && !string.IsNullOrEmpty(request.PhotoURL))
                    {
                        existingUser.ProfilePhoto = null; // Don't store Google photo URL in database
                        await _userDAL.UpdateUser(existingUser);
                        finalPhotoUrl = request.PhotoURL; // Use Google photo URL in response
                    }

                    return Ok(new
                    {
                        id = existingUser.Id,
                        username = existingUser.Username,
                        email = existingUser.Email,
                        favoriteAnimal = existingUser.FavoriteAnimal,
                        profilePhoto = finalPhotoUrl // Return stored photo or Google photo URL
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during Google login for user: {Email}", request.Email);
                return StatusCode(500, new { message = "An error occurred during Google login" });
            }
        }

        [HttpPut("{id}/favorite-animal")]
        public async Task<IActionResult> UpdateFavoriteAnimal(int id, [FromBody] FavoriteAnimalUpdate update)
        {
            try
            {
                if (update == null || string.IsNullOrEmpty(update.FavoriteAnimal))
                {
                    return BadRequest(new { Message = "Favorite animal is required." });
                }

                var existingUser = _userDAL.GetUserById(id);
                if (existingUser == null)
                {
                    return NotFound(new { Message = $"User with Id {id} not found." });
                }

                existingUser.FavoriteAnimal = update.FavoriteAnimal;
                bool updateSuccess = await _userDAL.UpdateUser(existingUser);

                if (!updateSuccess)
                {
                    return StatusCode(500, new { Message = "Failed to update favorite animal." });
                }

                return Ok(new { 
                    Message = "Favorite animal updated successfully",
                    FavoriteAnimal = update.FavoriteAnimal
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Failed to update favorite animal: {ex.Message}" });
            }
        }

        public class FavoriteAnimalUpdate
        {
            public string FavoriteAnimal { get; set; } = string.Empty;
        }
    }

    public class ProfilePhotoUpdate
    {
        public string? ProfilePhoto { get; set; }
    }
}
