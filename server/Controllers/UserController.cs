using Microsoft.AspNetCore.Mvc;
using server.DAL;
using server.Models;

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



        // POST api/<UserController>
        /// <summary>
        /// Creates a new user.
        /// </summary>
        /// <param name="email" name="username" name="passwordHash">The user to create.</param>
        /// using userDto.cs file in models to add only username,password,email when new user created.
        [HttpPost]
        public IActionResult Post([FromBody] UserDto userDto)
        {
            if (userDto == null)
            {
                return BadRequest("Invalid user data.");
            }

            Console.WriteLine($"Username = {userDto.Username}");
            Console.WriteLine($"PasswordHash = {userDto.PasswordHash}");
            Console.WriteLine($"Email = {userDto.Email}");

            int newUserId = _userDAL.AddNewUserToDB(userDto);

            if (newUserId <= 0)
            {
                return StatusCode(500, "Failed to create user.");
            }

            return Ok(new { Message = "User created successfully", UserId = newUserId });
        }

        // POST /api/user/login - Check if user exists in the database
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserInput userInput)
        {
            if (userInput == null || string.IsNullOrEmpty(userInput.Username) || string.IsNullOrEmpty(userInput.Password))
            {
                return BadRequest("Invalid login credentials.");
            }

            // Check if the user credentials are valid
            bool isValidUser = _userDAL.CheckUserCredentials(userInput.Username, userInput.Password);

            if (!isValidUser)
            {
                return Unauthorized("Invalid username or password.");
            }

            // You can implement JWT or other tokens here for successful login
            return Ok(new { Message = "Login successful." });
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
        public IActionResult UpdatePreferences(int id, [FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest("Invalid user data.");
            }

            var existingUser = _userDAL.GetUserById(id);
            if (existingUser == null)
            {
                return NotFound($"User with Id {id} not found.");
            }

            // Only update the preference fields, keep other fields unchanged
            existingUser.FavoriteAnimal = user.FavoriteAnimal;
            existingUser.FavoriteDriverId = user.FavoriteDriverId;
            existingUser.FavoriteTeamId = user.FavoriteTeamId;
            existingUser.FavoriteRacingSpotId = user.FavoriteRacingSpotId;

            // Update user preferences in the database
            bool updateSuccess = _userDAL.UpdateUserPreferences(id, existingUser);

            if (!updateSuccess)
            {
                return StatusCode(500, "Failed to update user preferences.");
            }

            return Ok(new { Message = "User preferences updated successfully" });
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
    }
}
