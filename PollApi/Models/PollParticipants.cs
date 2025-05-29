using System.ComponentModel.DataAnnotations;

namespace PollApi.Models
{
    public class PollParticipant
    {
        public int PollId { get; set; }
        public Poll Poll { get; set; }

        [StringLength(128)]
        public string UserId { get; set; }
        public User User { get; set; }

        public DateTime? InvitedAt { get; set; }

        [StringLength(50)]
        public string Role { get; set; }  // e.g., "Participant", "Organizer"
    }
}