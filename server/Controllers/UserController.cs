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

                try {
                    // Get user profile including photo
                    var userProfile = _userDAL.GetUserProfile(user.Id);
                    Console.WriteLine($"Retrieved profile for user {user.Id}. Profile photo exists: {userProfile?.ProfilePhoto != null}");
                    
                    // If profile photo exists but doesn't have prefix, add it
                    string? profilePhoto = userProfile?.ProfilePhoto;
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

                    Console.WriteLine($"Login response prepared. Profile photo included: {profilePhoto != null}");
                    return Ok(response);
                }
                catch (Exception ex) {
                    Console.WriteLine($"Error creating or serializing response: {ex.Message}");
                    Console.WriteLine($"Stack trace: {ex.StackTrace}");
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

        [HttpPost("{id}/profile-photo")]
        public IActionResult UpdateProfilePhoto(int id, [FromBody] ProfilePhotoUpdate photoUpdate)
        {
            try
            {
                Console.WriteLine($"Attempting to update profile photo for user {id}");
                
                if (photoUpdate == null || string.IsNullOrEmpty(photoUpdate.ProfilePhoto))
                {
                    Console.WriteLine("Photo data is null or empty");
                    return BadRequest(new { Message = "Photo data is required." });
                }

                var existingUser = _userDAL.GetUserById(id);
                if (existingUser == null)
                {
                    Console.WriteLine($"User with Id {id} not found");
                    return NotFound(new { Message = $"User with Id {id} not found." });
                }
                Console.WriteLine($"Found user {existingUser.Username}");

                // Log the photo data details
                var photoLength = photoUpdate.ProfilePhoto.Length;
                var isBase64 = photoUpdate.ProfilePhoto.Contains("base64");
                var hasPrefix = photoUpdate.ProfilePhoto.StartsWith("data:image");
                Console.WriteLine($"Photo data length: {photoLength}");
                Console.WriteLine($"Contains 'base64': {isBase64}");
                Console.WriteLine($"Has image prefix: {hasPrefix}");

                try
                {
                    // Store the raw base64 data (without prefix) in the database
                    string photoData = photoUpdate.ProfilePhoto;
                    if (photoData.Contains(","))
                    {
                        var parts = photoData.Split(',');
                        Console.WriteLine($"Split parts count: {parts.Length}");
                        Console.WriteLine($"Prefix part: {parts[0]}");
                        photoData = parts[1];
                    }

                    Console.WriteLine($"Final photo data length: {photoData.Length}");
                    bool updateSuccess = _userDAL.UpdateProfilePhoto(id, photoData);

                    if (!updateSuccess)
                    {
                        Console.WriteLine("Failed to update profile photo in database");
                        return StatusCode(500, new { Message = "Failed to update profile photo." });
                    }

                    Console.WriteLine("Successfully updated profile photo");
                    
                    return Ok(new { 
                        Message = "Profile photo updated successfully",
                        User = new {
                            Id = existingUser.Id.ToString(),
                            Username = existingUser.Username,
                            Profile = new {
                                ProfilePhoto = photoUpdate.ProfilePhoto,  // Return the original photo data with prefix
                                FavoriteAnimal = existingUser.FavoriteAnimal
                            }
                        }
                    });
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error processing photo data: {ex.Message}");
                    Console.WriteLine($"Stack trace: {ex.StackTrace}");
                    Console.WriteLine("Failed to update profile photo in database");
                    return StatusCode(500, new { Message = "Failed to update profile photo." });
                }

                Console.WriteLine("Successfully updated profile photo");
                
                // Return the response in the format expected by the frontend
                return Ok(new { 
                    Message = "Profile photo updated successfully",
                    User = new {
                        Id = existingUser.Id.ToString(),
                        Username = existingUser.Username,
                        Profile = new {
                            ProfilePhoto = photoUpdate?.ProfilePhoto,  // Return the original photo data with prefix
                            FavoriteAnimal = existingUser.FavoriteAnimal
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating profile photo: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { Message = $"Failed to update profile photo: {ex.Message}" });
            }
        }
    }

    public class ProfilePhotoUpdate
    {
        public string? ProfilePhoto { get; set; }
    }
}
