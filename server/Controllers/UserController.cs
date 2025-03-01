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
        // GET: api/<UserController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }
        public class UserInput
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public string Email { get; set; }
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
        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
