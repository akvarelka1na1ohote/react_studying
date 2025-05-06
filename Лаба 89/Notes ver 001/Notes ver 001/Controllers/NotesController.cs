using Microsoft.AspNetCore.Mvc;
using Notes_ver_001.Contracts;
using Notes_ver_001.DataAccess;
using Notes_ver_001.Models;
using System.Linq.Expressions;

namespace Notes_ver_001.Controllers;

[ApiController]
[Route("[controller]")]


public class NotesController : ControllerBase
{
    private readonly NotesDbConext _dbContext;
    public NotesController(NotesDbConext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateNoteRequest request, CancellationToken ct)
    {
        var note = new Note(request.Title, request.Description);

        await _dbContext.Notes.AddAsync(note, ct);
        await _dbContext.SaveChangesAsync(ct);

        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] GetNotesRequest request, CancellationToken ct)
    {
        var notesQuery = _dbContext.Notes
            .Where(n => !string.IsNullOrWhiteSpace(request.Search) ||
                        n.Title.ToLower().Contains(request.Search.ToLower()));

        Expression<Func<Note, object>> selectorKey = request.SortItem?.ToLower() switch
        {
            "date" => note => note.CreatedAt,
            "title" => note => note.Title,
            _ => note => note.Id
        };
        notesQuery = request.SortOrder == "desc"

            ? notesQuery = notesQuery.OrderByDescending(selectorKey)
            : notesQuery.OrderByDescending(selectorKey);

        var noteDtos = await notesQuery
            .Select(n => new NoteDto(n.Id, n.Title, n.Description, n.CreatedAt))
            .ToListAsync(ct);
        return Ok(new GetNotesResponse(noteDtos));



    }
}
