using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PollApi;
using PollApi.Models;
using PollApi.DTOs;

namespace PollApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly PollContext _ctx;
        public UsersController(PollContext ctx) => _ctx = ctx;

        // GET api/users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> Get(string id)
        {
            var user = await _ctx.Users.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(new UserDto(user.Id, user.UserName, user.Email));
        }

        // POST api/users
        [HttpPost]
        public async Task<ActionResult<UserDto>> Create([FromBody] CreateUserDto dto)
        {
            if (await _ctx.Users.AnyAsync(u => u.Id == dto.Id))
                return Conflict($"User with Id '{dto.Id}' already exists.");

            var user = new User
            {
                Id = dto.Id,
                UserName = dto.UserName,
                Email = dto.Email
            };

            _ctx.Users.Add(user);
            await _ctx.SaveChangesAsync();

            var result = new UserDto(user.Id, user.UserName, user.Email);
            return CreatedAtAction(nameof(Get), new { id = user.Id }, result);
        }
    }
}
