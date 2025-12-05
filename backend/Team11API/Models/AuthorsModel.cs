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
            string authorsQuery = @"SELECT 
                a.AuthorID,
                a.FirstName + ' ' + a.LastName AS AuthorName,
                a.CoverImage
            FROM Authors a
            ORDER BY a.AuthorID;
            ";
            string authorInformationQuery = @"
            SELECT 
                COUNT(DISTINCT b.GenreID) AS totalGenres,
                COUNT(DISTINCT b.BookID) AS totalBooks
            FROM Books b
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
                
                // Query 1
                using (SqlCommand cmd = new SqlCommand(authorsQuery, conn))
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

                // Query 2
                using (SqlCommand cmd2 = new SqlCommand(authorInformationQuery, conn))
                using (SqlDataReader reader2 = await cmd2.ExecuteReaderAsync())
                {
                    if (await reader2.ReadAsync())
                    {
                        aad.totalBooks = reader2.GetInt32(reader2.GetOrdinal("totalBooks"));
                        aad.totalGenres = reader2.GetInt32(reader2.GetOrdinal("totalGenres"));
                    }
                }
            }

            return aad;
        }

        public async Task<AuthorInformationDto> GetAuthorInfo(int authorId)
        {
            string authorInfoQuery = @"
            SELECT 
                a.AuthorID,
                a.FirstName + ' ' + a.LastName AS AuthorName,
                a.Description,
                a.CoverImage,
                COUNT(DISTINCT b.BookID) AS TotalBooks,
                AVG(r.Rating) AS AvgRating
            FROM Authors a
            LEFT JOIN Books b ON a.AuthorID = b.AuthorID
            LEFT JOIN Reviews r ON b.BookID = r.BookID
            WHERE a.AuthorID = @AuthorID
            GROUP BY 
                a.AuthorID,
                a.FirstName,
                a.LastName,
                a.Description,
                a.CoverImage;
            ";
            string genreInfoQuery = @"
                SELECT DISTINCT
                    g.Name
                FROM Genres g
                JOIN Books b
                    ON g.GenreID = b.GenreID
                WHERE b.AuthorID = @AuthorID;
            ";

            AuthorInformationDto aid = new AuthorInformationDto
            {
                author = new Author(),
            };

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();
                
                // Query 1
                using (SqlCommand cmd = new SqlCommand(authorInfoQuery, conn))
                {
                    cmd.Parameters.AddWithValue("@AuthorID", authorId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var author = new Author
                            {
                                authorId = reader.GetInt32(reader.GetOrdinal("AuthorID")),
                                name = reader.GetString(reader.GetOrdinal("AuthorName")),
                                description = reader.GetString(reader.GetOrdinal("Description")),
                                totalBooks = reader.GetInt32(reader.GetOrdinal("TotalBooks")),
                                coverImage = reader.IsDBNull(reader.GetOrdinal("CoverImage"))
                                    ? null
                                    : Convert.ToString(reader["CoverImage"]),
                                avgRating = reader.IsDBNull(reader.GetOrdinal("AvgRating"))
                                    ? (double?)null
                                    : Convert.ToDouble(reader["AvgRating"])
                            };

                            aid.author = author;
                        }
                    }
                }

                List<string> genres = new List<string>();
                // Query 2
                using (SqlCommand cmd2 = new SqlCommand(genreInfoQuery, conn))
                {
                    cmd2.Parameters.AddWithValue("@AuthorID", authorId);

                    using (SqlDataReader reader2 = await cmd2.ExecuteReaderAsync())
                    {
                        while (await reader2.ReadAsync())
                        {
                            genres.Add(reader2.GetString(reader2.GetOrdinal("Name")));
                        }
                    }                   
                }

                Console.WriteLine($"GENRES: ", genres);
                aid.author.genres = genres;
                return aid;
            }
        }
    }
}

 