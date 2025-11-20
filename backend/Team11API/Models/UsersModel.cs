using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using Team11API.DTOs;
using Team11API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Team11API.Models
{
    public class UsersModel
    {
        private Database _db;

        public UsersModel()
        {

        }

        public void SetDatabaseValue(Database db) 
        {
            _db = db;
        }

        public async Task<AuthDto> ValidateSignIn(SignInBody body)
        {
            string sql = "SELECT COUNT(*) FROM Users WHERE UserID = @UserID AND Password = @Password";
            AuthDto authDto = new AuthDto
            {
                UserID = body.UserID,
                IsValid = false
            };

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@UserID", body.UserID);
                    cmd.Parameters.AddWithValue("@Password", body.Password);

                    int userCount = (int)await cmd.ExecuteScalarAsync();
                    Console.WriteLine($"USER COUNT: {userCount}");
                    authDto.IsValid = userCount > 0;
                }
            }

            return authDto;
        }

        public async Task<AuthDto> CreateUser(SignUpBody body)
        {
            string sql = "INSERT INTO Users (UserID, FirstName, LastName, Password) VALUES (@UserID, @FirstName, @LastName, @Password)";
            AuthDto authDto = new AuthDto
            {
                UserID = body.UserID,
                IsValid = false
            };

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@UserID", body.UserID);
                    cmd.Parameters.AddWithValue("@FirstName", body.FirstName);
                    cmd.Parameters.AddWithValue("@LastName", body.LastName);
                    cmd.Parameters.AddWithValue("@Password", body.Password);

                    int rowsAffected = await cmd.ExecuteNonQueryAsync();

                   authDto.IsValid = rowsAffected > 0;
                }
            }

            return authDto;
        }
    }
}
