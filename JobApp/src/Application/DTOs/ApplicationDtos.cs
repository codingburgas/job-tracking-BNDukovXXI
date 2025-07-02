namespace JobApp.Application.DTOs;

public class ApplicationDtos
{

public class ApplicationDto
{
    public Guid Id { get; set; } 
    public Guid JobPostingId { get; set; }
    public string JobTitle { get; set; } = string.Empty; 
    public string ApplicantName { get; set; } = string.Empty; 
    public DateTime DateApplied { get; set; }
    public string Status { get; set; } = string.Empty;
}


public record CreateApplicationDto(Guid JobPostingId);

public record UpdateApplicationStatusDto(string Status);
}