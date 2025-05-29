using System.ComponentModel.DataAnnotations;

namespace PollApi.Models
{
    public class Poll
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [Required]
        [StringLength(128)]
        public string CreatedById { get; set; }

        public User CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<Question> Questions { get; set; }
        public ICollection<PollParticipant> Participants { get; set; }
    }
}