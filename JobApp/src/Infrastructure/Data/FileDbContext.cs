using System.Text.Json;
using JobApp.Core.Entities;
using Microsoft.Extensions.Hosting;

namespace JobApp.Infrastructure.Data;

public class FileDbContext
{
    private readonly string _basePath;
    private readonly JsonSerializerOptions _jsonOptions;

    public List<User> Users { get; private set; }
    public List<JobPosting> JobPostings { get; private set; }
    public List<Core.Entities.Application> Applications { get; private set; }

    public FileDbContext(IHostEnvironment env)
    {
        _basePath = Path.Combine(env.ContentRootPath, "DataFiles");
        if (!Directory.Exists(_basePath))
        {
            Directory.CreateDirectory(_basePath);
        }
        
        _jsonOptions = new JsonSerializerOptions { WriteIndented = true, PropertyNameCaseInsensitive = true };

        Users = LoadData<User>("users.json");
        JobPostings = LoadData<JobPosting>("jobpostings.json");
        Applications = LoadData<Core.Entities.Application>("applications.json");
    }

    private List<T> LoadData<T>(string fileName)
    {
        var filePath = Path.Combine(_basePath, fileName);
        if (!File.Exists(filePath))
        {
            return new List<T>();
        }

        var json = File.ReadAllText(filePath);
        return JsonSerializer.Deserialize<List<T>>(json, _jsonOptions) ?? new List<T>();
    }

    public async Task SaveChangesAsync()
    {
        await SaveDataAsync("users.json", Users);
        await SaveDataAsync("jobpostings.json", JobPostings);
        await SaveDataAsync("applications.json", Applications);
    }

    private async Task SaveDataAsync<T>(string fileName, List<T> data)
    {
        var filePath = Path.Combine(_basePath, fileName);
        var json = JsonSerializer.Serialize(data, _jsonOptions);
        await File.WriteAllTextAsync(filePath, json);
    }
}