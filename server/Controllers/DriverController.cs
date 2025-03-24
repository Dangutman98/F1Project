using Microsoft.AspNetCore.Mvc;
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

        // GET: api/Driver/fetch - Fetch drivers from OpenF1 API
        [HttpGet("fetch")]
        public async Task<ActionResult<List<Driver>>> FetchDrivers()
        {
            try
            {
                var drivers = await _driverDal.FetchDriversFromApiAsync();

                if (drivers != null && drivers.Count != 0)
                {
                    return Ok(drivers);
                }
                else
                {
                    return NotFound("No drivers found from OpenF1 API");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in FetchDrivers: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Driver - Get drivers from database
        [HttpGet]
        public async Task<ActionResult<List<Driver>>> GetDrivers()
        {
            try
            {
                var drivers = await _driverDal.FetchDriversFromDbAsync();

                if (drivers != null && drivers.Count != 0)
                {
                    return Ok(drivers);
                }
                else
                {
                    return NotFound("No drivers found in database");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetDrivers: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/Driver/save/clearAndSave - Clear existing drivers and save new ones from API
        [HttpPost("save/clearAndSave")]
        public async Task<ActionResult> ClearAndSaveDrivers()
        {
            try
            {
                Console.WriteLine("Deleting all drivers...");
                await _driverDal.DeleteAllDriversAsync();

                Console.WriteLine("Fetching new drivers from API...");
                var drivers = await _driverDal.FetchDriversFromApiAsync();

                if (drivers == null || !drivers.Any())
                {
                    return BadRequest("No drivers fetched from API.");
                }

                Console.WriteLine($"Fetched {drivers.Count} drivers.");

                Console.WriteLine("Saving drivers to database...");
                await _driverDal.SaveDriversToDatabaseAsync(drivers);

                return Ok("All previous drivers were deleted, and new drivers were saved successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ClearAndSaveDrivers: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/Driver/update/{id} - Update a specific driver
        [HttpPut("update/{id}")]
        public async Task<ActionResult> UpdateDriver(int id)
        {
            try
            {
                // Fetch the driver data from the API
                var drivers = await _driverDal.FetchDriversFromApiAsync();

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
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateDriver: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}