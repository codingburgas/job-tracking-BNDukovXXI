namespace JobApp.Application.DTOs;

public class UserDtos
{
    public record RegisterDto(string FirstName, string LastName, string UserName, string Email, string Password);
    public record LoginDto(string Email, string Password);
    public record UserDto(string Id, string FirstName, string LastName, string UserName, string Email);
}