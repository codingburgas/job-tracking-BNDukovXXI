using AutoMapper;
using JobApp.Application.DTOs;
using JobApp.Core.Entities;

namespace JobApp.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDtos.UserDto>();
        
        CreateMap<JobPosting, JobDtos.JobPostingDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
        CreateMap<JobDtos.CreateJobPostingDto, JobPosting>();
        
        CreateMap<Core.Entities.Application, ApplicationDtos.ApplicationDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.JobTitle, opt => opt.Ignore()) 
            .ForMember(dest => dest.ApplicantName, opt => opt.Ignore()); 
    }
}