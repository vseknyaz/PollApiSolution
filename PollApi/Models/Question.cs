using System.ComponentModel.DataAnnotations;

namespace PollApi.Models
{
    public class Question
    {
        public int Id { get; set; }

        public int PollId { get; set; }
        public Poll Poll { get; set; }

        [Required]
        [StringLength(500)]
        public string Text { get; set; }

        public ICollection<Choice> Choices { get; set; }
    }
}