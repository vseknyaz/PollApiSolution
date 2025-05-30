using PollApi.Models;
namespace PollApi.DTOs
{

    public record PollDto(int Id, string Title, string Description);
    public record PollDetailDto(Poll Poll)
    {
        public int Id = Poll.Id;
        public string Title = Poll.Title;
        public string Description = Poll.Description;
        public DateTime CreatedAt = Poll.CreatedAt;
        public IEnumerable<QuestionDto> Questions = Poll.Questions.Select(q => new QuestionDto(q));
        public IEnumerable<ParticipantDto> Participants = Poll.Participants.Select(pp => new ParticipantDto(pp));
    }

    public record CreatePollDto(string Title, string Description, string CreatedById);
    public record UpdatePollDto(string Title, string Description);

    public record ParticipantDto(string UserId, string Role, DateTime? InvitedAt)
    {
        public ParticipantDto(PollParticipant pp) : this(pp.UserId, pp.Role, pp.InvitedAt) { }
    }
    public record InviteParticipantDto(string UserId, string Role);

    public record QuestionDto(int Id, string Text)
    {
        public QuestionDto(Question q) : this(q.Id, q.Text) { }
    }
    public record CreateQuestionDto(string Text);
    public record UpdateQuestionDto(string Text);

    public record ChoiceDto(int Id, string Text)
    {
        public ChoiceDto(Choice c) : this(c.Id, c.Text) { }
    }
    public record CreateChoiceDto(string Text);
    public record UpdateChoiceDto(string Text);

    public record VoteDto(string UserId, int ChoiceId);

    public record ChoiceResultDto(int ChoiceId, string Text, int VoteCount)
    {
        public ChoiceResultDto(Choice c) : this(c.Id, c.Text, c.Votes.Count) { }
    }
    public record QuestionResultDto(int QuestionId, string QuestionText, IEnumerable<ChoiceResultDto> Choices)
    {
        public QuestionResultDto(Question q)
            : this(q.Id, q.Text, q.Choices.Select(c => new ChoiceResultDto(c))) { }
    }
    public record UserDto(
        string Id,
        string UserName,
        string Email
    );

    public record CreateUserDto(
        string Id,
        string UserName,
        string Email
    );
}