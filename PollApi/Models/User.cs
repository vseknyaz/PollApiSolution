using System.ComponentModel.DataAnnotations;

namespace PollApi.Models
{
    public class User
    {
        [Key]
        [StringLength(128)]
        public string Id { get; set; }

        [Required]
        [StringLength(256)]
        public string UserName { get; set; }

        [Required]
        [StringLength(256)]
        public string Email { get; set; }

        public ICollection<PollParticipant> PollParticipations { get; set; }
        public ICollection<Vote> Votes { get; set; }
    }
}