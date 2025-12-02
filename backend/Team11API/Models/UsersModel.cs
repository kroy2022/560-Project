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

        public UsersModel() {}

        public void SetDatabaseValue(Database db) 
        {
            _db = db;
        }

    
        public async Task<AuthDto> ValidateSignIn(SignInBody body)
        {
            Console.WriteLine($"EMAIL: {body.Email} AND password: {body.Password}");
            string sql = "SELECT UserID, FirstName, LastName FROM Users WHERE Email = @Email AND Password = @Password";
            AuthDto authDto = new AuthDto
            {
                UserID = null,
                FirstName = null,
                LastName = null,
                IsValid = false
            };

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@Email", body.Email);
                    cmd.Parameters.AddWithValue("@Password", body.Password); 

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            authDto.UserID = reader.GetInt32(0);
                            authDto.FirstName = reader.GetString(1);
                            authDto.LastName = reader.GetString(2);
                            authDto.IsValid = true;
                        }
                    }
                }
            }

            return authDto;
        }

        public async Task<AuthDto> CreateUser(SignUpBody body)
        {
            string sql = @"
                INSERT INTO Users (Email, FirstName, LastName, Password) 
                VALUES (@Email, @FirstName, @LastName, @Password);
                SELECT CAST(SCOPE_IDENTITY() AS int);
            ";
            AuthDto authDto = new AuthDto
            {
                UserID = null,
                IsValid = false
            };

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@Email", body.Email);
                    cmd.Parameters.AddWithValue("@FirstName", body.FirstName);
                    cmd.Parameters.AddWithValue("@LastName", body.LastName);
                    cmd.Parameters.AddWithValue("@Password", body.Password);

                    object result = await cmd.ExecuteScalarAsync();
                    int newUserId = Convert.ToInt32(result);

                    authDto.UserID = newUserId;
                    authDto.IsValid = true;
                }
            }

            return authDto;
        }
    }
}
