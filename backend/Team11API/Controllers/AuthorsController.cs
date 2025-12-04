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

    [HttpGet("")]
    public async Task<IActionResult> GetAllAuthorsRoute()
    {
        AllAuthorsDto result = _authorsModel.
    }


    // POST REQUESTS


}
