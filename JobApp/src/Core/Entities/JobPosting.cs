using JobApp.Core.Enums;

namespace JobApp.Core.Entities;

public class JobPosting
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DatePosted { get; set; }
    public JobStatus Status { get; set; }
    public string CreatedByAdminId { get; set; } = null!;
}