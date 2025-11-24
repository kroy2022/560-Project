using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Team11API.Services;

namespace Team11API.Controllers;

[ApiController]
[Route("books/")]
public class BooksController : ControllerBase
{
    private readonly Database _db;

    public BooksController(Database db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = new List<object>();

        using (var conn = _db.GetConnection())
        {
            await conn.OpenAsync();

            var cmd = new SqlCommand("SELECT TOP 20 * FROM Users", conn);
            var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                users.Add(new
                {
                    Id = reader["Id"],
                    Name = reader["Name"],
                    Email = reader["Email"]
                });
            }
        }

        return Ok(users);
    }
}
