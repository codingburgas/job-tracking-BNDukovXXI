using AutoMapper;
using JobApp.Application.DTOs;
using JobApp.Core.Entities;
using JobApp.Core.Enums;
using JobApp.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JobApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobPostingsController : ControllerBase
{
    private readonly FileDbContext _context;
    private readonly IMapper _mapper;

    public JobPostingsController(FileDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    
    [HttpGet]
    public ActionResult<IEnumerable<JobDtos.JobPostingDto>> GetActiveJobPostings()
    {
        var jobPostings = _context.JobPostings
            .Where(jp => jp.Status == JobStatus.Active)
            .OrderByDescending(jp => jp.DatePosted)
            .ToList(); // Променяме на ToList()
        return _mapper.Map<List<JobDtos.JobPostingDto>>(jobPostings);
    }

    [HttpGet("all")]
    [Authorize(Roles = Role.Admin)]
    public ActionResult<IEnumerable<JobDtos.JobPostingDto>> GetAllJobPostings()
    {
        var jobPostings = _context.JobPostings
            .OrderByDescending(jp => jp.DatePosted)
            .ToList();
        return _mapper.Map<List<JobDtos.JobPostingDto>>(jobPostings);
    }

    [HttpGet("{id}")]
    public ActionResult<JobDtos.JobPostingDto> GetJobPosting(Guid id)
    {
        var jobPosting = _context.JobPostings.FirstOrDefault(jp => jp.Id == id);
        if (jobPosting == null) return NotFound();
        return _mapper.Map<JobDtos.JobPostingDto>(jobPosting);
    }

    [HttpPost]
    [Authorize(Roles = Role.Admin)]
    public async Task<ActionResult<JobDtos.JobPostingDto>> CreateJobPosting(JobDtos.CreateJobPostingDto createDto)
    {
        var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(adminId)) return Unauthorized();

        var jobPosting = _mapper.Map<JobPosting>(createDto);
        jobPosting.Id = Guid.NewGuid();
        jobPosting.DatePosted = DateTime.UtcNow;
        jobPosting.Status = JobStatus.Active;
        jobPosting.CreatedByAdminId = adminId;

        _context.JobPostings.Add(jobPosting);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetJobPosting), new { id = jobPosting.Id }, _mapper.Map<JobDtos.JobPostingDto>(jobPosting));
    }
    
    [HttpPut("{id}")]
    [Authorize(Roles = Role.Admin)]
    public async Task<IActionResult> UpdateJobPosting(Guid id, JobDtos.JobPostingDto updateDto)
    {
        if (id != updateDto.Id) return BadRequest();

        var jobPosting = _context.JobPostings.FirstOrDefault(jp => jp.Id == id);
        if (jobPosting == null) return NotFound();
        
        jobPosting.Title = updateDto.Title;
        jobPosting.Company = updateDto.Company;
        jobPosting.Description = updateDto.Description;
        jobPosting.Status = Enum.Parse<JobStatus>(updateDto.Status);

        await _context.SaveChangesAsync();
        return NoContent();
    }
}