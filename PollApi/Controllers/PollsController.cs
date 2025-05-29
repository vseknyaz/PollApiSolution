using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PollApi;
using PollApi.Models;
using PollApi.DTOs;

namespace PollApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PollsController : ControllerBase
    {
        private readonly PollContext _ctx;
        public PollsController(PollContext ctx)
        {
            _ctx = ctx;
        }

        // GET: api/polls
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PollDto>>> GetAll()
        {
            var list = await _ctx.Polls
                .Select(p => new PollDto(p.Id, p.Title, p.Description))
                .ToListAsync();
            return Ok(list);
        }

        // GET: api/polls/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<PollDetailDto>> Get(int id)
        {
            var poll = await _ctx.Polls
                .Include(p => p.Questions)
                    .ThenInclude(q => q.Choices)
                .Include(p => p.Participants)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (poll == null)
                return NotFound();

            return Ok(new PollDetailDto(poll));
        }

        // POST: api/polls
        [HttpPost]
        public async Task<ActionResult<PollDto>> Create([FromBody] CreatePollDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest("Title is required.");

            var poll = new Poll
            {
                Title = dto.Title,
                Description = dto.Description,
                CreatedById = dto.CreatedById,    // тепер беремо з dto
                CreatedAt = DateTime.UtcNow
            };

            _ctx.Polls.Add(poll);
            await _ctx.SaveChangesAsync();

            var resultDto = new PollDto(poll.Id, poll.Title, poll.Description);
            return CreatedAtAction(nameof(Get), new { id = poll.Id }, resultDto);
        }

        // PUT: api/polls/{id}
        [HttpPut("{id:int}")]
        public async Task<ActionResult> Update(int id, [FromBody] UpdatePollDto dto)
        {
            var poll = await _ctx.Polls.FindAsync(id);
            if (poll == null)
                return NotFound();

            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest("Title cannot be empty.");

            poll.Title = dto.Title;
            poll.Description = dto.Description;
            await _ctx.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/polls/{id}
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var poll = await _ctx.Polls.FindAsync(id);
            if (poll == null)
                return NotFound();

            _ctx.Polls.Remove(poll);
            await _ctx.SaveChangesAsync();
            return NoContent();
        }
    }
}
