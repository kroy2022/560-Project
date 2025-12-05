using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.IdentityModel.Tokens;
using Team11API.DTOs;
using Team11API.Models;
using Team11API.Services;

namespace Team11API.Controllers;

[ApiController]
[Route("book")]
public class BookController : ControllerBase
{
    private readonly Database _db;
    private readonly BookModel _bookModel = new BookModel();

    public BookController(Database db)
    {
        _db = db;
        _bookModel.SetDatabaseValue(_db);
    }

    // GET REQUESTS

    [HttpGet("info")]
    public async Task<IActionResult> GetBookInformationRoute([FromQuery] int? bookId, [FromQuery] int? userId)
    {
        int finalBookId = bookId ?? -1;
        int finalUserId = userId ?? -1;

        if (finalBookId == -1)
        {
            return BadRequest("Invalid bookId.");
        } else if (finalUserId == -1)
        {
            return BadRequest("Invalid userId.");
        }

        Console.WriteLine($"BOOK ID: {finalBookId}");
        BookInformationDto result = await _bookModel.GetBookInformation(finalBookId, finalUserId);
        Console.WriteLine($"BOOK INFORMATION RESULT: {result}");
        return Ok(result); 
    }

    [HttpGet("reviews")]
    public async Task<IActionResult> GetBookReviewsRoute([FromQuery] int? bookId)
    {
        int finalBookId = bookId ?? -1;

        if (finalBookId == -1)
        {
            return BadRequest("Invalid bookId.");
        }

        Console.WriteLine($"BOOK ID: {finalBookId}");
        BookReviewsDto result = await _bookModel.GetBookReviews(finalBookId);
        Console.WriteLine($"BOOK REVIEWS RESULT: {result}");
        return Ok(result);
    }

    // This endpoint retrieves 5 books with same author, and 5 books with same genre. If less than 5 books with same author that gap is filled with books in genre. 
    [HttpGet("similar-books")]
    public async Task<IActionResult> GetSimilarBooksRoute([FromQuery] string? genre, [FromQuery] string? author, [FromQuery] int? bookId)
    {
        string finalGenre = genre ?? "";
        string finalAuthor = author ?? "";
        int finalBookId = bookId ?? -1;

        if (string.IsNullOrEmpty(finalGenre))
        {
            return BadRequest("Genre is empty");
        } else if (string.IsNullOrEmpty(finalAuthor))
        {
            return BadRequest("Author is empty");
        } else if (finalBookId == -1)
        {
          return BadRequest("Invalid bookId.");  
        }

        Console.WriteLine($"GENRE: {finalGenre} + AUTHOR: {finalAuthor}");
        BooksDto result = await _bookModel.GetSimilarBooks(finalGenre, finalAuthor, finalBookId);
        Console.WriteLine($"GET SIMILAR BOOKS RESULT: {result}");
        return Ok(result);
    }   

    [HttpGet("books")]
    public async Task<IActionResult> GetBooksWithFilterRoute([FromQuery] int? authorId, [FromQuery] int? genreId)
    {   
        BooksDto result;
        if (authorId is int aid)
        {
            result = await _bookModel.GetBooksForAuthor(aid);
        } else if (genreId is int gid)
        {
            result = await _bookModel.GetBooksFromGenre(gid);
        } else
        {
            result = await _bookModel.GetBooks();
        }

        return Ok(result);
    }

    // POST REQUESTS
    [HttpPost("save")]
    public async Task<IActionResult> SaveBookRoute([FromBody] SaveBookBody body)
    {
        if (!ModelState.IsValid)
        {
            Console.WriteLine($"INVALID MODEL STATE: {ModelState}");
            return BadRequest(ModelState);
        }

        Console.WriteLine($"USER ID: {body.userId} AND BOOK ID: {body.bookId} AND IS CURRENTLY SAVED: {body.isCurrentlySaved}");
        bool valid;

        // unsave
        if (body.isCurrentlySaved == 1)
        {
            valid = await _bookModel.UnsaveBook(body);
        } // save
        else
        {
            valid = await _bookModel.SaveBook(body);
        }

        if (!valid)
        {
            return BadRequest("Error changing book saved status");
        }

        return Ok();
    }

    [HttpPost("review/create")]
    public async Task<IActionResult> WriteReviewRoute([FromBody] WriteReviewBody body)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        Console.WriteLine($"USER ID: {body.userId} AND BOOK ID: {body.bookId} AND RATING: {body.rating}, AND CONTENT: {body.content}");
        int isValid = await _bookModel.WriteReview(body);

        if (isValid == -1)
        {
            return BadRequest("Error saving review");
        }

        CreateReviewDto result = new CreateReviewDto
        {
            reviewId = isValid
        };

        return Ok(result);
    }
}
