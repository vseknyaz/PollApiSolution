using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PollApi;
using PollApi.Models;
using PollApi.DTOs;

namespace PollApi.Controllers
{
    [ApiController]
    [Route("api/polls/{pollId:int}")]
    public class VotesController : ControllerBase
    {
        private readonly PollContext _ctx;
        public VotesController(PollContext ctx) => _ctx = ctx;

        [HttpPost("votes")]
        public async Task<ActionResult> Vote(int pollId, VoteDto dto)
        {
            var choice = await _ctx.Choices
                .Include(c => c.Question)
                .FirstOrDefaultAsync(c => c.Id == dto.ChoiceId && c.Question.PollId == pollId);
            if (choice == null) return BadRequest();

            bool exists = await _ctx.Votes
                .AnyAsync(v => v.UserId == dto.UserId && v.Choice.QuestionId == choice.QuestionId);
            if (exists) return Conflict();

            _ctx.Votes.Add(new Vote { UserId = dto.UserId, ChoiceId = dto.ChoiceId, VotedAt = DateTime.UtcNow });
            await _ctx.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("results")]
        public async Task<ActionResult<IEnumerable<QuestionResultDto>>> Results(int pollId)
        {
            var poll = await _ctx.Polls
                .Include(p => p.Questions).ThenInclude(q => q.Choices).ThenInclude(c => c.Votes)
                .FirstOrDefaultAsync(p => p.Id == pollId);
            if (poll == null) return NotFound();

            var results = poll.Questions.Select(q => new QuestionResultDto(q)).ToList();
            return Ok(results);
        }
    }
}
