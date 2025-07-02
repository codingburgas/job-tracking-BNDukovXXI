

      
using System.Security.Claims;
using System.Text;
using JobApp.Core.Enums;
using JobApp.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddSingleton<FileDbContext>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});


builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(Role.Admin, policy => policy.RequireClaim(ClaimTypes.Role, Role.Admin));
    options.AddPolicy(Role.User, policy => policy.RequireClaim(ClaimTypes.Role, Role.User));
});


builder.Services.AddAutoMapper(typeof(JobApp.Application.Mappings.MappingProfile));


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {

});

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FileDbContext>();
    if (!context.Users.Any(u => u.Role == Role.Admin))
    {
        var adminUser = new JobApp.Core.Entities.User
        {
            UserName = "adminuser",
            Email = "admin@jobapp.com",
            FirstName = "Admin",
            LastName = "User",
            Role = Role.Admin,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin_123") // Хеширане на паролата
        };
        context.Users.Add(adminUser);
        await context.SaveChangesAsync();
    }
}


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngularApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

    