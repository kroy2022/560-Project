using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Team11API.DTOs;
using Team11API.Models;
using Team11API.Services;

namespace Team11API.Controllers;

[ApiController]
[Route("auth")]
public class UsersController : ControllerBase
{
    private readonly Database _db;
    private readonly UsersModel _usersModel = new UsersModel();

    public UsersController(Database db)
    {
        _db = db;
        _usersModel.SetDatabaseValue(db);
    }

    [HttpPost("signin")]
    public async Task<IActionResult> SignInRoute([FromBody] SignInBody body)
    {
        AuthDto result = await _usersModel.ValidateSignIn(body);
        Console.WriteLine($"SIGN IN RESULT: {result}");
        return Ok(result);
    }

    [HttpPost("signup")]
    public async Task<IActionResult> SignUpRoute([FromBody] SignUpBody body)
    {
        AuthDto result = await _usersModel.CreateUser(body);
        Console.WriteLine($"SIGN UP RESULT: {result}");
        return Ok(result);
    }
}
