namespace JobApp.Application.DTOs;

public class JobDtos
{
    public class JobPostingDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime DatePosted { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public record CreateJobPostingDto(string Title, string Company, string Description);
}
