using System.ComponentModel.DataAnnotations;

namespace PollApi.Models
{
    public class Choice
    {
        public int Id { get; set; }

        public int QuestionId { get; set; }
        public Question Question { get; set; }

        [Required]
        [StringLength(200)]
        public string Text { get; set; }

        public ICollection<Vote> Votes { get; set; }
    }
}