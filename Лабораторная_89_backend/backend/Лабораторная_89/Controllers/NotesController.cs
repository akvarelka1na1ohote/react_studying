using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyNotes.Contracts;
using MyNotes.DataAccess;
using System.Linq;
using System.Linq.Expressions;
using Лабораторная_89.Contracts;
using Лабораторная_89.Model;


namespace MyNotes.Controllers;

[ApiController]
[Route("[controller]")]

public class NotesController : ControllerBase

{   private readonly NotesDbContext _dbContext;

    public NotesController(NotesDbContext dbContext)
    { 
        _dbContext = dbContext;

        
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateNoteRequest request, CancellationToken ct)
    {
        var note = new Note(request.Title, request.Description);

        await _dbContext.Notes.AddAsync(note,ct);
        await _dbContext.SaveChangesAsync(ct);

        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult>Get([FromQuery]GetNotesRequest request,CancellationToken ct)
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
        
            ? notesQuery= notesQuery.OrderByDescending(selectorKey)
            : notesQuery.OrderByDescending(selectorKey);

        var noteDtos = await notesQuery
            .Select(n => new NoteDto(n.Id, n.Title,n.Description, n.CreatedAt))
            .ToListAsync(ct);
        return Ok(new GetNotesResponse(noteDtos));



        }
    }


