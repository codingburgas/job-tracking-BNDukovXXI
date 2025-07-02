using FluentValidation;
using JobApp.Application.DTOs;

namespace JobApp.Application.Validation;

public class CreateJobPostingDtoValidator : AbstractValidator<JobDtos.CreateJobPostingDto>
{
    public CreateJobPostingDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");

        RuleFor(x => x.Company)
            .NotEmpty().WithMessage("Company name is required.")
            .MaximumLength(150).WithMessage("Company name cannot exceed 150 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.");
    }
}