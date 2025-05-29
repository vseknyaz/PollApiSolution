using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PollApi;
using PollApi.Models;
using PollApi.DTOs;

namespace PollApi.Controllers
{
    [ApiController]
    [Route("api/polls/{pollId:int}/participants")]
    public class ParticipantsController : ControllerBase
    {
        private readonly PollContext _ctx;
        public ParticipantsController(PollContext ctx) => _ctx = ctx;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ParticipantDto>>> GetAll(int pollId)
        {
            if (!await _ctx.Polls.AnyAsync(p => p.Id == pollId))
                return NotFound();
            var list = await _ctx.PollParticipants
                .Where(pp => pp.PollId == pollId)
                .Select(pp => new ParticipantDto(pp))
                .ToListAsync();
            return Ok(list);
        }

        [HttpPost]
        public async Task<ActionResult> Invite(int pollId, InviteParticipantDto dto)
        {
            if (!await _ctx.Polls.AnyAsync(p => p.Id == pollId)) return NotFound();
            if (await _ctx.PollParticipants.AnyAsync(pp => pp.PollId == pollId && pp.UserId == dto.UserId))
                return Conflict();
            var pp = new PollParticipant { PollId = pollId, UserId = dto.UserId, Role = dto.Role, InvitedAt = DateTime.UtcNow };
            _ctx.PollParticipants.Add(pp);
            await _ctx.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { pollId }, null);
        }

        [HttpDelete("{userId}")]
        public async Task<ActionResult> Remove(int pollId, string userId)
        {
            var pp = await _ctx.PollParticipants.FindAsync(pollId, userId);
            if (pp == null) return NotFound();
            _ctx.PollParticipants.Remove(pp);
            await _ctx.SaveChangesAsync();
            return NoContent();
        }
    }
}
