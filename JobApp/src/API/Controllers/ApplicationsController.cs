using AutoMapper;
using JobApp.Application.DTOs;
using JobApp.Core.Enums;
using JobApp.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JobApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly FileDbContext _context;
    private readonly IMapper _mapper;

    public ApplicationsController(FileDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpPost]
    [Authorize(Roles = Role.User)]
    public async Task<IActionResult> SubmitApplication([FromBody] ApplicationDtos.CreateApplicationDto createDto)
    {
        var applicantId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(applicantId)) return Unauthorized();

        var alreadyApplied = _context.Applications
            .Any(a => a.ApplicantId == applicantId && a.JobPostingId == createDto.JobPostingId);
        
        if (alreadyApplied)
            return Conflict(new { Message = "You have already applied for this job." });
            
        if (!_context.JobPostings.Any(jp => jp.Id == createDto.JobPostingId))
            return BadRequest(new { Message = "Job posting does not exist." });

        var application = new Core.Entities.Application
        {
            Id = Guid.NewGuid(),
            JobPostingId = createDto.JobPostingId,
            ApplicantId = applicantId,
            DateApplied = DateTime.UtcNow,
            Status = ApplicationStatus.Submitted
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Application submitted successfully." });
    }

    [HttpGet("my")]
    [Authorize(Roles = Role.User)]
    public ActionResult<IEnumerable<ApplicationDtos.ApplicationDto>> GetMyApplications()
    {
        var applicantId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var applications = _context.Applications.Where(a => a.ApplicantId == applicantId).ToList();
        
        var applicationDtos = applications.Select(app =>
        {
            var dto = _mapper.Map<ApplicationDtos.ApplicationDto>(app);
            var job = _context.JobPostings.FirstOrDefault(j => j.Id == app.JobPostingId);
            var applicant = _context.Users.FirstOrDefault(u => u.Id == app.ApplicantId);
            
            dto.JobTitle = job?.Title ?? "Unknown Job";
            dto.ApplicantName = $"{applicant?.FirstName} {applicant?.LastName}";
            return dto;
        }).OrderByDescending(a => a.DateApplied).ToList();
        
        return Ok(applicationDtos);
    }
    
    [HttpGet("job/{jobId}")]
    [Authorize(Roles = Role.Admin)]
    public ActionResult<IEnumerable<ApplicationDtos.ApplicationDto>> GetApplicationsForJob(Guid jobId)
    {
        var applications = _context.Applications.Where(a => a.JobPostingId == jobId).ToList();
        
        var applicationDtos = applications.Select(app =>
        {
            var dto = _mapper.Map<ApplicationDtos.ApplicationDto>(app);
            var job = _context.JobPostings.FirstOrDefault(j => j.Id == app.JobPostingId);
            var applicant = _context.Users.FirstOrDefault(u => u.Id == app.ApplicantId);
            
            dto.JobTitle = job?.Title ?? "Unknown Job";
            dto.ApplicantName = $"{applicant?.FirstName} {applicant?.LastName}";
            return dto;
        }).OrderByDescending(a => a.DateApplied).ToList();
        
        return Ok(applicationDtos);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = Role.Admin)]
    public async Task<IActionResult> UpdateApplicationStatus(Guid id, [FromBody] ApplicationDtos.UpdateApplicationStatusDto statusDto)
    {
        var application = _context.Applications.FirstOrDefault(a => a.Id == id);
        if (application == null) return NotFound();

        if (Enum.TryParse<ApplicationStatus>(statusDto.Status, true, out var newStatus))
        {
            application.Status = newStatus;
            await _context.SaveChangesAsync();
            return Ok();
        }

        return BadRequest(new { Message = "Invalid status value." });
    }
}