using Microsoft.EntityFrameworkCore;
using Notes_ver_001.Model;

namespace Notes_ver_001.DataAccess;

public class NotesDbConext : DbContext
{
    private readonly IConfiguration _configuration;

    public NotesDbConext(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public DbSet<Note> Notes => Set<Note>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(_configuration.GetConnectionString("Database"));
    }
}
