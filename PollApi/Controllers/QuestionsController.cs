using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PollApi;
using PollApi.Models;
using PollApi.DTOs;

namespace PollApi.Controllers
{
    [ApiController]
    [Route("api/polls/{pollId:int}/questions")]
    public class QuestionsController : ControllerBase
    {
        private readonly PollContext _ctx;
        public QuestionsController(PollContext ctx) => _ctx = ctx;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionDto>>> GetAll(int pollId)
        {
            if (!await _ctx.Polls.AnyAsync(p => p.Id == pollId)) return NotFound();
            var items = await _ctx.Questions
                .Where(q => q.PollId == pollId)
                .Select(q => new QuestionDto(q))
                .ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<QuestionDto>> Get(int pollId, int id)
        {
            var q = await _ctx.Questions
                .FirstOrDefaultAsync(x => x.PollId == pollId && x.Id == id);
            return q == null ? NotFound() : Ok(new QuestionDto(q));
        }

        [HttpPost]
        public async Task<ActionResult<QuestionDto>> Create(int pollId, CreateQuestionDto dto)
        {
            if (!await _ctx.Polls.AnyAsync(p => p.Id == pollId)) return NotFound();
            var q = new Question { PollId = pollId, Text = dto.Text };
            _ctx.Questions.Add(q);
            await _ctx.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { pollId, id = q.Id }, new QuestionDto(q));
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> Update(int pollId, int id, UpdateQuestionDto dto)
        {
            var q = await _ctx.Questions.FindAsync(id);
            if (q == null || q.PollId != pollId) return NotFound();
            q.Text = dto.Text;
            await _ctx.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int pollId, int id)
        {
            var q = await _ctx.Questions.Include(x => x.Choices).FirstOrDefaultAsync(x => x.PollId == pollId && x.Id == id);
            if (q == null) return NotFound();
            _ctx.Choices.RemoveRange(q.Choices);
            _ctx.Questions.Remove(q);
            await _ctx.SaveChangesAsync();
            return NoContent();
        }
    }
}
