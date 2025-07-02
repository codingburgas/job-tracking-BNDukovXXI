using JobApp.Core.Enums;

namespace JobApp.Core.Entities;

public class Application
{
    public Guid Id { get; set; }
    public Guid JobPostingId { get; set; }
    public string ApplicantId { get; set; } = null!; // Това ще е User.Id
    public DateTime DateApplied { get; set; }
    public ApplicationStatus Status { get; set; }
}