using Microsoft.EntityFrameworkCore;
using PollApi.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace PollApi
{
    public class PollContext : DbContext
    {
        public PollContext(DbContextOptions<PollContext> opts)
            : base(opts) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Poll> Polls { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Choice> Choices { get; set; }
        public DbSet<Vote> Votes { get; set; }
        public DbSet<PollParticipant> PollParticipants { get; set; }

        protected override void OnModelCreating(ModelBuilder mb)
        {
            mb.Entity<Vote>()
              .HasKey(v => new { v.UserId, v.ChoiceId });

            mb.Entity<Vote>()
              .HasOne(v => v.User).WithMany(u => u.Votes)
              .HasForeignKey(v => v.UserId);

            mb.Entity<Vote>()
              .HasOne(v => v.Choice).WithMany(c => c.Votes)
              .HasForeignKey(v => v.ChoiceId);

            mb.Entity<PollParticipant>()
              .HasKey(pp => new { pp.PollId, pp.UserId });

            mb.Entity<PollParticipant>()
              .HasOne(pp => pp.Poll).WithMany(p => p.Participants)
              .HasForeignKey(pp => pp.PollId);

            mb.Entity<PollParticipant>()
              .HasOne(pp => pp.User).WithMany(u => u.PollParticipations)
              .HasForeignKey(pp => pp.UserId);

            // інші зв’язки EF Core із навігаціями хватить
        }
    }
}
