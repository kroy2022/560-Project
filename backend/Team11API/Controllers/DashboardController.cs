using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Team11API.DTOs;
using Team11API.Models;
using Team11API.Services;

namespace Team11API.Controllers;

[ApiController]
[Route("dashboard")]
public class DashboardController : ControllerBase
{
    private readonly Database _db;
    private readonly DashboardModel _dashboardModel = new DashboardModel();

    public DashboardController(Database db)
    {
        _db = db;
        _dashboardModel.SetDatabaseValue(_db);
    }

    // GET REQUESTS

    [HttpGet("featured")]
    public async Task<IActionResult> FeaturedBookRoute()
    {
        Console.WriteLine("IN FEATURED BOOK");
        FeaturedBookDto result = await _dashboardModel.GetFeaturedBook();
        return Ok(result);
    }

    [HttpGet("top-reviewed")]
    public async Task<IActionResult> TopReviewedBooksRoute()
    {
        Console.WriteLine("IN TOP REVIEWED");
        PopularBooksDto result = await _dashboardModel.GetPopularBooks();
        return Ok(result);
    }

    [HttpGet("genre-books")]
    public async Task<IActionResult> GetGenreBooksRoute()
    {
        GenreRowsDto result = await _dashboardModel.GetGenreRows();
        return Ok(result);
    }

    [HttpGet("genre")]
    public async Task<IActionResult> GetGenreBooksWithOffetRoute([FromQuery] int? genreId, [FromQuery] int? offset)
    {
        int finalGenreId = genreId ?? 0;
        int finalOffset = offset ?? 0;

        Console.WriteLine($"GENRE ID: {finalGenreId} AND OFFSET: {finalOffset}");
        RowBooksDto result = await _dashboardModel.GetGenreBooksWithOffet(finalGenreId, finalOffset);
        Console.WriteLine($"GENRE BOOKS WITH OFFSET RESULT: {result}");
        return Ok(result); 
    }

    [HttpGet("search")]
    public async Task<IActionResult> GetSearchResultsRoute([FromQuery] string? query)
    {
        string searchQuery = query ?? "";

        if (string.IsNullOrEmpty(searchQuery))
        {
            return BadRequest("Empty search query");
        }

        SearchResultsDto result = await _dashboardModel.GetSearchResults(searchQuery);
        return Ok(result); 
    }   

    // POST REQUESTS

    [HttpPost("saved")]
    public async Task<IActionResult> SavedBooksRoute([FromBody] SavedBooksBody body)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        RowBooksDto result = await _dashboardModel.GetSavedBooks(body);
        return Ok(result);
    }

}
