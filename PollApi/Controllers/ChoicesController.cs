using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PollApi;
using PollApi.Models;
using PollApi.DTOs;

namespace PollApi.Controllers
{
    [ApiController]
    [Route("api/questions/{questionId:int}/choices")]
    public class ChoicesController : ControllerBase
    {
        private readonly PollContext _ctx;
        public ChoicesController(PollContext ctx) => _ctx = ctx;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChoiceDto>>> GetAll(int questionId)
        {
            if (!await _ctx.Questions.AnyAsync(q => q.Id == questionId)) return NotFound();
            var list = await _ctx.Choices
                .Where(c => c.QuestionId == questionId)
                .Select(c => new ChoiceDto(c))
                .ToListAsync();
            return Ok(list);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ChoiceDto>> Get(int questionId, int id)
        {
            var c = await _ctx.Choices
                .FirstOrDefaultAsync(x => x.QuestionId == questionId && x.Id == id);
            return c == null ? NotFound() : Ok(new ChoiceDto(c));
        }

        [HttpPost]
        public async Task<ActionResult<ChoiceDto>> Create(int questionId, CreateChoiceDto dto)
        {
            if (!await _ctx.Questions.AnyAsync(q => q.Id == questionId)) return NotFound();
            var c = new Choice { QuestionId = questionId, Text = dto.Text };
            _ctx.Choices.Add(c);
            await _ctx.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { questionId, id = c.Id }, new ChoiceDto(c));
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> Update(int questionId, int id, UpdateChoiceDto dto)
        {
            var c = await _ctx.Choices.FindAsync(id);
            if (c == null || c.QuestionId != questionId) return NotFound();
            c.Text = dto.Text;
            await _ctx.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int questionId, int id)
        {
            var c = await _ctx.Choices.FindAsync(id);
            if (c == null || c.QuestionId != questionId) return NotFound();
            _ctx.Votes.RemoveRange(_ctx.Votes.Where(v => v.ChoiceId == id));
            _ctx.Choices.Remove(c);
            await _ctx.SaveChangesAsync();
            return NoContent();
        }
    }
}
