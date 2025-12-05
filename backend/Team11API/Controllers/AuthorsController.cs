using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Team11API.DTOs;
using Team11API.Models;
using Team11API.Services;

namespace Team11API.Controllers;

[ApiController]
[Route("authors")]
public class AuthorsController : ControllerBase
{
    private readonly Database _db;
    private readonly AuthorsModel _authorsModel = new AuthorsModel();

    public AuthorsController(Database db)
    {
        _db = db;
        _authorsModel.SetDatabaseValue(_db);
    }

    // GET REQUESTS

    [HttpGet("overview")]
    public async Task<IActionResult> GetAllAuthorsRoute()
    {
        AllAuthorsDto result = await _authorsModel.GetAllAuthors();
        return Ok(result);
    }

    [HttpGet("author")]
    public async Task<IActionResult> GetAuthorInformationRoute([FromQuery] int? authorId)
    {
        Console.WriteLine($"IN AUTHOR ROUTE, author id: {authorId}");
        int finalAuthorId = authorId ?? -1;

        if (finalAuthorId == -1)
        {
            return BadRequest("Invalid author id");
        }

        AuthorInformationDto result = await _authorsModel.GetAuthorInfo(finalAuthorId);
        return Ok(result);
    }    

    // POST REQUESTS


}
