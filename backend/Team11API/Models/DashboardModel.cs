using System.Data;
using System.Text.Json;
using Microsoft.Data.SqlClient;
using Team11API.DTOs;
using Team11API.Services;

namespace Team11API.Models
{
    public class DashboardModel
    {
        private Database _db;
        
        public DashboardModel() {}

        public void SetDatabaseValue(Database db)
        {
            _db = db;
        }

        public async Task<FeaturedBookDto> GetFeaturedBook()
        {
            string sql = @"SELECT TOP 1
                b.BookID, 
                b.ISBN, 
                b.Title, 
                b.Description,
                b.PublicationDate, 
                b.CoverImage, 
                a.FirstName + ' ' + a.LastName AS Author, 
                g.Name AS Genre, 
                avg_ratings.AvgRating 
            FROM Books b
            JOIN Authors a ON b.AuthorID = a.AuthorID
            JOIN Genres g ON b.GenreID = g.GenreID
            LEFT JOIN (
                SELECT BookID, AVG(Rating) AS AvgRating
                FROM Reviews
                GROUP BY BookID
            ) avg_ratings ON b.BookID = avg_ratings.BookID
            ORDER BY avg_ratings.AvgRating DESC;";

            FeaturedBookDto fbd = new FeaturedBookDto
            {
                featuredBook = new PopularBook()
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
                            var book = new PopularBook
                            {
                                bookId = reader.GetInt32(reader.GetOrdinal("BookID")),
                                isbn = reader.GetString(reader.GetOrdinal("ISBN")),
                                title = reader.GetString(reader.GetOrdinal("Title")),
                                description = reader.GetString(reader.GetOrdinal("Description")),
                                coverImage = reader.GetString(reader.GetOrdinal("CoverImage")),
                                author = reader.GetString(reader.GetOrdinal("Author")),
                                genre = reader.GetString(reader.GetOrdinal("Genre")),
                                avgRating = reader.IsDBNull(reader.GetOrdinal("AvgRating"))
                                    ? 0.0
                                    : Convert.ToDouble(reader["AvgRating"])
                            };

                            fbd.featuredBook = book;
                        }
                    }
                }
            }

            return fbd;
        }

        public static DateTime RandomDate(DateTime start, DateTime end)
        {
            Random rand = new Random();
            int range = (end - start).Days;
            return start.AddDays(rand.Next(range));
        }

        public async Task<PopularBooksDto> GetPopularBooks()
        {
            string sql = @"
            SELECT TOP 9
                b.BookID, 
                b.ISBN, 
                b.Title, 
                b.Description,
                b.Publisher,
                b.PublicationDate, 
                b.CoverImage, 
                a.FirstName + ' ' + a.LastName AS Author, 
                g.Name AS Genre, 
                avg_ratings.AvgRating,
                avg_ratings.TotalReviews
            FROM Books b
            JOIN Authors a ON b.AuthorID = a.AuthorID
            JOIN Genres g ON b.GenreID = g.GenreID
            LEFT JOIN (
                SELECT BookID, AVG(Rating) AS AvgRating, COUNT(*) AS TotalReviews
                FROM Reviews
                GROUP BY BookID
            ) avg_ratings ON b.BookID = avg_ratings.BookID
            ORDER BY avg_ratings.AvgRating DESC, avg_ratings.TotalReviews DESC;
            ";
            PopularBooksDto popularBooksDto = new PopularBooksDto { popularBooks = new List<PopularBook>() };

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();
                
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var book = new PopularBook
                            {
                                bookId = reader.GetInt32(reader.GetOrdinal("BookID")),
                                isbn = reader.GetString(reader.GetOrdinal("ISBN")),
                                title = reader.GetString(reader.GetOrdinal("Title")),
                                description = reader.GetString(reader.GetOrdinal("Description")),
                                coverImage = reader.GetString(reader.GetOrdinal("CoverImage")),
                                author = reader.GetString(reader.GetOrdinal("Author")),
                                genre = reader.GetString(reader.GetOrdinal("Genre")),
                                publisher = reader.GetString(reader.GetOrdinal("Publisher")),
                                publicationDate = reader.GetDateTime(reader.GetOrdinal("PublicationDate")),
                                avgRating = reader.IsDBNull(reader.GetOrdinal("AvgRating"))
                                    ? 0.0
                                    : Convert.ToDouble(reader["AvgRating"]),
                                totalReviews = reader.IsDBNull(reader.GetOrdinal("TotalReviews"))
                                    ? 0
                                    : Convert.ToInt32(reader["TotalReviews"])
                            };

                            popularBooksDto.popularBooks.Add(book);
                        }
                    }
                }
            }

            return popularBooksDto;
        }

        public async Task<RowBooksDto> GetSavedBooks(SavedBooksBody body)
        {
            string sql = "SELECT b.BookID, b.ISBN, b.Title, b.Description, b.PublicationDate, b.CoverImage, a.FirstName + ' ' + a.LastName AS Author, g.Name AS genre From Books b JOIN SavedBooks sb ON b.BookID = sb.BookID AND sb.userID = @UserID JOIN Authors a ON b.AuthorID = a.AuthorID JOIN Genres g ON b.GenreID = g.GenreID;";
            RowBooksDto savedBooksDto = new RowBooksDto { books = new List<Book>() };
            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();
                
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@UserID", body.UserID);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var book = new Book
                            {
                                bookId = reader.GetInt32(reader.GetOrdinal("BookID")),
                                isbn = reader.GetString(reader.GetOrdinal("ISBN")),
                                title = reader.GetString(reader.GetOrdinal("Title")),
                                description = reader.GetString(reader.GetOrdinal("Description")),
                                coverImage = reader.GetString(reader.GetOrdinal("CoverImage")),
                                author = reader.GetString(reader.GetOrdinal("Author")),
                                genre = reader.GetString(reader.GetOrdinal("Genre"))
                            };

                            savedBooksDto.books.Add(book);
                        }
                    }
                }
            }

            return savedBooksDto;
        }

        public async Task<GenreRowsDto> GetGenreRows()
        {
            string sql = "SELECT g.GenreID, g.Name, (SELECT TOP 15 b.BookID AS bookId, b.ISBN AS isbn, b.Title AS title, b.CoverImage AS coverImage, b.Description AS description, b.PublicationDate AS publicationDate, a.FirstName + ' ' + a.LastName AS author FROM Books b JOIN Authors a ON b.AuthorID = a.AuthorID WHERE b.GenreID = g.GenreID ORDER BY b.BookID FOR JSON PATH) AS genreBooks FROM Genres g;";
            GenreRowsDto genreRowsDto = new GenreRowsDto { genreRows = new List<GenreRow>() };
            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();
                
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var genreBooksJson = reader.GetString(2); 
                            var books = JsonSerializer.Deserialize<List<Book>>(genreBooksJson);
                            
                            GenreRow gw = new GenreRow
                            {
                                genreId = reader.GetInt32(0),
                                genre = reader.GetString(1),
                                genreBooks = books,
                                offset = 10,
                            };

                            genreRowsDto.genreRows.Add(gw);
                        }
                    }
                }
            }

            return genreRowsDto;
        }

        public async Task<RowBooksDto> GetGenreBooksWithOffet(int genreId, int offset)
        {
            string sql = "SELECT b.BookID, b.ISBN, b.Title, b.Description, b.PublicationDate, b.CoverImage, a.FirstName + ' ' + a.LastName AS Author FROM Books b JOIN Authors a ON b.AuthorID = a.AuthorID WHERE b.GenreID = @GenreID ORDER BY b.BookID OFFSET @Offset ROWS FETCH NEXT 10 ROWS ONLY FOR JSON PATH";
            RowBooksDto genreBooks = new RowBooksDto
            {
                books = new List<Book>()
            };

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();
                
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@GenreID", genreId);
                    cmd.Parameters.AddWithValue("@Offset", offset);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var book = new Book
                            {
                                bookId = reader.GetInt32(reader.GetOrdinal("BookID")),
                                isbn = reader.GetString(reader.GetOrdinal("ISBN")),
                                title = reader.GetString(reader.GetOrdinal("Title")),
                                description = reader.GetString(reader.GetOrdinal("Description")),
                                coverImage = reader.GetString(reader.GetOrdinal("CoverImage")),
                                author = reader.GetString(reader.GetOrdinal("Author")),
                                genre = reader.GetString(reader.GetOrdinal("Genre"))
                            };

                            genreBooks.books.Add(book);
                        }
                    }
                }
            }

            return genreBooks;
        }

        public async Task<SearchResultsDto> GetSearchResults(string searchQuery)
        {
            string sql = @"SELECT 
                b.BookID, 
                b.ISBN, 
                b.Title, 
                b.Description, 
                b.PublicationDate, 
                b.CoverImage, 
                g.Name AS genre, 
                a.FirstName + ' ' + a.LastName AS Author
            FROM Books b
            JOIN Authors a ON b.AuthorID = a.AuthorID
            JOIN Genres g ON b.GenreID = g.GenreID
            WHERE b.Title LIKE '%' + @SearchQuery + '%' OR a.FirstName + ' ' + a.LastName LIKE '%' + @SearchQuery + '%' OR g.Name LIKE '%' + @SearchQuery + '%' OR b.Publisher LIKE '%' + @SearchQuery + '%' 
            ORDER BY b.BookID;
            ";
            SearchResultsDto srd = new SearchResultsDto
            {
                searchResults = new List<Book>()
            };

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();
                
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@SearchQuery", searchQuery);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var book = new Book
                            {
                                bookId = reader.GetInt32(reader.GetOrdinal("BookID")),
                                isbn = reader.GetString(reader.GetOrdinal("ISBN")),
                                title = reader.GetString(reader.GetOrdinal("Title")),
                                description = reader.GetString(reader.GetOrdinal("Description")),
                                coverImage = reader.GetString(reader.GetOrdinal("CoverImage")),
                                author = reader.GetString(reader.GetOrdinal("Author")),
                                genre = reader.GetString(reader.GetOrdinal("Genre"))
                            };

                            srd.searchResults.Add(book);
                        }
                    }
                }
            }

            return srd;
        }
    }
}
