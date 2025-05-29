using System.ComponentModel.DataAnnotations;

namespace PollApi.Models
{
    public class Vote
    {
        [StringLength(128)]
        public string UserId { get; set; }
        public User User { get; set; }

        public int ChoiceId { get; set; }
        public Choice Choice { get; set; }

        public DateTime VotedAt { get; set; }
    }
}