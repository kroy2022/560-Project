using System.ComponentModel.Design;
using System.Data;
using System.Text.Json;
using Microsoft.Data.SqlClient;
using Team11API.DTOs;
using Team11API.Services;

namespace Team11API.Models
{
    public class AuthorsModel
    {
        private Database _db;
        
        public AuthorsModel() {}

        public void SetDatabaseValue(Database db)
        {
            _db = db;
        }

        public async Task<AllAuthorsDto> GetAllAuthors()
        {
            string sql = @"SELECT 
                a.AuthorID,
                a.FirstName + ' ' + a.LastName AS AuthorName,
                a.CoverImage
            FROM Authors a
            ORDER BY a.AuthorID;
            ";
            AllAuthorsDto aad = new AllAuthorsDto
            {
                authors = new List<AuthorSummary>(),
                totalBooks = 0,
                totalGenres = 0
            };

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();
                
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var authorSummary = new AuthorSummary
                            {
                                authorId = reader.GetInt32(reader.GetOrdinal("AuthorID")),
                                name = reader.GetString(reader.GetOrdinal("AuthorName")),
                                coverImage = reader.IsDBNull(reader.GetOrdinal("CoverImage"))
                                    ? null
                                    : Convert.ToString(reader["CoverImage"])
                            };

                            aad.authors.Add(authorSummary);
                        }
                    }
                }
            }
        }
    }
}

 