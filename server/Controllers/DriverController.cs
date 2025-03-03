using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using server.DAL;
using server.Models;


namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverController(DriverDal driverDal) : ControllerBase
    {
        private readonly DriverDal _driverDal = driverDal;

  
        // Fetch drivers from OpenF1 API
        [HttpGet("fetch")]
        public async Task<ActionResult<List<Driver>>> FetchDrivers()
        {
            var drivers = await _driverDal.FetchDriversAsync();

            // If the list is not empty, return it; otherwise, return a message
            if (drivers != null && drivers.Count != 0)
            {
                return Ok(drivers); // This will automatically serialize the list of Driver objects to JSON
            }
            else
            {
                return NotFound("No drivers found");
            }
        }

        [HttpPost("save/clearAndSave")]
        public async Task<ActionResult> ClearAndSaveDrivers()
        {
            // First, delete all existing drivers in the database
            await _driverDal.DeleteAllDriversAsync();

            // Fetch the new drivers data
            var drivers = await _driverDal.FetchDriversAsync();

            // Save the new drivers to the database
            await _driverDal.SaveDriversToDatabaseAsync(drivers);

            return Ok("All previous drivers were deleted, and new drivers were saved successfully.");
        }

   

        [HttpPut("update/{id}")]
        public async Task<ActionResult> UpdateDriver(int id)
        {
            // Fetch the driver data from the API
            var drivers = await _driverDal.FetchDriversAsync();

            // Find the driver with the specified ID
            var driverToUpdate = drivers.FirstOrDefault(d => d.Id == id);

            if (driverToUpdate == null)
            {
                return NotFound("Driver not found.");
            }

            // Save the updated driver data to the database
            await _driverDal.SaveDriversToDatabaseAsync([driverToUpdate]);

            return Ok("Driver updated successfully.");
        }

    
    }
}