using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using server.DAL;
using server.Models;


namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverController : ControllerBase
    {

        private readonly DriverDal _driverDal;

        public DriverController(DriverDal driverDal)
        {
            _driverDal = driverDal;
        }

        // GET: api/<DriverController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // Fetch drivers from OpenF1 API
        [HttpGet("fetch")]
        
        public async Task<ActionResult<List<Driver>>> FetchDrivers()
        {
            var drivers = await _driverDal.FetchDriversAsync();

            // Ensure the data is not empty or null before returning
            if (drivers != null && drivers.Any())
            {
                Console.WriteLine("Drivers fetched successfully.");
                return Ok(drivers); // Return the list of drivers if data is present
                
            }
            else
            {
                return NotFound("No drivers found"); // Return 404 if no data found
            }
        }


        // Fetch and save drivers to the database
        [HttpPost("save")]
        public async Task<ActionResult> SaveDrivers()
        {
            var drivers = await _driverDal.FetchDriversAsync();
            await _driverDal.SaveDriversToDatabaseAsync(drivers);
            return Ok("Drivers saved successfully.");
        }

        // GET api/<DriverController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<DriverController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<DriverController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<DriverController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
