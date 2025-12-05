using System.Data;
using System.Text.Json;
using Microsoft.Data.SqlClient;
using Team11API.DTOs;
using Team11API.Services;

namespace Team11API.Models
{
    public class BookModel
    {
        private Database _db;
        
        public BookModel() {}

        public void SetDatabaseValue(Database db)
        {
            _db = db;
        }

        public async Task<BookInformationDto> GetBookInformation(int bookId, int userId)
        {
            string sql = @"
                SELECT 
                    b.BookID,
                    b.ISBN,
                    b.Title,
                    b.Description,
                    b.PublicationDate,
                    b.Publisher,
                    b.CoverImage,
                    a.FirstName + ' ' + a.LastName AS Author,
                    g.Name AS Genre,
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 
                            FROM SavedBooks sb
                            WHERE sb.BookID = b.BookID 
                            AND sb.UserID = @UserID
                        ) 
                        THEN 1 ELSE 0 
                    END AS isSaved
                FROM Books b
                JOIN Authors a ON b.AuthorID = a.AuthorID
                JOIN Genres g ON b.GenreID = g.GenreID
                WHERE b.BookID = @BookID";

            BookInformationDto bit = new BookInformationDto();

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@BookID", bookId);
                    cmd.Parameters.AddWithValue("@UserID", userId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            bit.book = new Book
                            {
                                bookId = reader.GetInt32(reader.GetOrdinal("BookID")),
                                isbn = reader.GetString(reader.GetOrdinal("ISBN")),
                                title = reader.GetString(reader.GetOrdinal("Title")),
                                description = reader.GetString(reader.GetOrdinal("Description")),
                                coverImage = reader.GetString(reader.GetOrdinal("CoverImage")),
                                publicationDate = reader.GetDateTime(reader.GetOrdinal("PublicationDate")),
                                publisher = reader.GetString(reader.GetOrdinal("Publisher")),
                                author = reader.GetString(reader.GetOrdinal("Author")),
                                genre = reader.GetString(reader.GetOrdinal("Genre")),
                                isSaved = reader.GetInt32(reader.GetOrdinal("isSaved"))
                            };
                        }
                    }
                }
            }

            return bit;
        }

        public async Task<BookReviewsDto> GetBookReviews(int bookId)
        {
            string sql = @"SELECT 
                r.ReviewID AS reviewId,
                u.UserID AS userId,
                u.FirstName + ' ' + u.LastName AS userName,
                r.Rating AS rating,
                r.Content AS content, 
                r.ReviewDate AS reviewDate
            FROM Reviews r
            JOIN Users u 
                ON r.UserID = u.UserID
            WHERE r.BookID = @BookID";

            BookReviewsDto brd = new BookReviewsDto
            {
                reviews = new List<BookReview>()
            };

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@BookID", bookId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            BookReview br = new BookReview
                            {
                                reviewId = reader.GetInt32(reader.GetOrdinal("ReviewID")),
                                userId = reader.GetInt32(reader.GetOrdinal("UserID")),
                                userName = reader.GetString(reader.GetOrdinal("Username")),
                                rating = reader.GetByte(reader.GetOrdinal("Rating")),
                                content = reader.GetString(reader.GetOrdinal("Content")),
                                reviewDate = reader.GetDateTime(reader.GetOrdinal("ReviewDate")),
                            };

                            brd.reviews.Add(br);
                        }
                    }
                }
            }

            return brd;
        }

        public async Task<BooksDto> GetSimilarBooks(string genre, string author, int bookId)
        {
            string sql = @"
            WITH AuthorBooks AS (
                SELECT TOP 5
                    b.BookID,
                    b.Title,
                    b.CoverImage,
                    a.FirstName + ' ' + a.LastName AS Author,
                    1 AS Priority
                FROM Books b
                JOIN Authors a ON b.AuthorID = a.AuthorID
                WHERE a.FirstName + ' ' + a.LastName = @Author
                ORDER BY b.BookID
            ),
            GenreBooks AS (
                SELECT TOP 5
                    b.BookID,
                    b.Title,
                    b.CoverImage,
                    a.FirstName + ' ' + a.LastName AS Author,
                    2 AS Priority
                FROM Books b
                JOIN Authors a ON b.AuthorID = a.AuthorID
                JOIN Genres g ON b.GenreID = g.GenreID
                WHERE g.Name = @Genre
                ORDER BY b.BookID
            ),
            Combined AS (
                SELECT * FROM AuthorBooks
                UNION ALL
                SELECT * FROM GenreBooks
            )

            SELECT TOP 10
                c.BookID,
                MIN(c.Title) AS Title,
                MIN(c.CoverImage) AS CoverImage,
                MIN(c.Author) AS Author,
                MIN(c.Priority) AS Priority
            FROM Combined c
            WHERE c.BookID <> @BookID
            GROUP BY c.BookID
            ORDER BY MIN(c.Priority), c.BookID;
            ";

            BooksDto sbt = new BooksDto
            {
                books = new List<BookSummary>()
            };

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@Genre", genre);
                    cmd.Parameters.AddWithValue("@Author", author);
                    cmd.Parameters.AddWithValue("@BookID", bookId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            BookSummary bs = new BookSummary
                            {
                                bookId = reader.GetInt32(reader.GetOrdinal("BookID")),
                                title = reader.GetString(reader.GetOrdinal("Title")),
                                coverImage = reader.GetString(reader.GetOrdinal("CoverImage")),
                                author = reader.GetString(reader.GetOrdinal("Author")),
                            };

                            sbt.books.Add(bs);
                        }
                    }
                }
            }

            return sbt;
        }

        public async Task<BooksDto> GetBooksForAuthor(int authorId)
        {
            string sql = @"
                SELECT
                    b.BookID,
                    b.Title,
                    b.CoverImage,
                    a.FirstName + ' ' + a.LastName AS Author
                FROM Books b
                JOIN Authors a
                    ON b.AuthorID = a.AuthorID
                WHERE b.AuthorID = @AuthorID
            ";

            BooksDto bd = new BooksDto
            {
                books = new List<BookSummary>()
            };

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@AuthorID", authorId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            BookSummary bs = new BookSummary
                            {
                                bookId = reader.GetInt32(reader.GetOrdinal("BookID")),
                                title = reader.GetString(reader.GetOrdinal("Title")),
                                coverImage = reader.GetString(reader.GetOrdinal("CoverImage")),
                                author = reader.GetString(reader.GetOrdinal("Author")),
                            };

                            bd.books.Add(bs);
                        }
                    }
                }
            }

            return bd;
        }

        public async Task<BooksDto> GetBooksFromGenre(int genreId)
        {
            string sql = @"
                SELECT
                    b.BookID,
                    b.Title,
                    b.CoverImage,
                    a.FirstName + ' ' + a.LastName AS Author,
                    g.Name
                FROM Books b
                JOIN Authors a
                    ON b.AuthorID = a.AuthorID 
                JOIN Genres g
                    ON b.GenreID = g.GenreID
                WHERE b.GenreID = @GenreID
            ";

            BooksDto bd = new BooksDto
            {
                books = new List<BookSummary>()
            };

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@GenreID", genreId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            BookSummary bs = new BookSummary
                            {
                                bookId = reader.GetInt32(reader.GetOrdinal("BookID")),
                                title = reader.GetString(reader.GetOrdinal("Title")),
                                coverImage = reader.GetString(reader.GetOrdinal("CoverImage")),
                                author = reader.GetString(reader.GetOrdinal("Author")),
                                genre = reader.GetString(reader.GetOrdinal("Name"))
                            };

                            bd.books.Add(bs);
                        }
                    }
                }
            }

            return bd;
        }

        public async Task<BooksDto> GetBooks()
        {
            string sql = @"
                SELECT
                    b.BookID,
                    b.Title,
                    b.CoverImage,
                    a.FirstName + ' ' + a.LastName AS Author
                FROM Books b
                JOIN Authors a
                    ON b.AuthorID = a.AuthorID
            ";

            BooksDto bd = new BooksDto
            {
                books = new List<BookSummary>()
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
                            BookSummary bs = new BookSummary
                            {
                                bookId = reader.GetInt32(reader.GetOrdinal("BookID")),
                                title = reader.GetString(reader.GetOrdinal("Title")),
                                coverImage = reader.GetString(reader.GetOrdinal("CoverImage")),
                                author = reader.GetString(reader.GetOrdinal("Author")),
                            };

                            bd.books.Add(bs);
                        }
                    }
                }
            }

            return bd;
        }

        public async Task<bool> SaveBook(SaveBookBody body)
        {
            string sql = "INSERT INTO SavedBooks (UserID, BookID) VALUES (@UserID, @BookID)";

            try
            {
                using (var conn = _db.GetConnection())
                {
                    using (var cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@UserID", body.userId);
                        cmd.Parameters.AddWithValue("@BookID", body.bookId);

                        await conn.OpenAsync();
                        int rowsAffected = await cmd.ExecuteNonQueryAsync();

                        return rowsAffected > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving book: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> UnsaveBook(SaveBookBody body)
        {
            string sql = "DELETE FROM SavedBooks Where UserID = @UserID AND BookID = @BookID";

            try
            {
                using (var conn = _db.GetConnection())
                {
                    using (var cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@UserID", body.userId);
                        cmd.Parameters.AddWithValue("@BookID", body.bookId);

                        await conn.OpenAsync();
                        int rowsAffected = await cmd.ExecuteNonQueryAsync();

                        return rowsAffected == 1;
                    }
                }
            } catch (Exception ex)
            {
                Console.WriteLine($"Error unsaving book: {ex.Message}");
                return false;
            }
        }

        public async Task<int> WriteReview(WriteReviewBody body)
        {
            string sql = @"
                    INSERT INTO Reviews (UserID, BookID, Rating, Content)
                    VALUES (@UserID, @BookID, @Rating, @Content);
                    SELECT CAST(SCOPE_IDENTITY() AS INT);
                ";
            try
            {
                using (var conn = _db.GetConnection())
                {
                    using (var cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@UserID", body.userId);
                        cmd.Parameters.AddWithValue("@BookID", body.bookId);
                        cmd.Parameters.AddWithValue("@Rating", body.rating);
                        cmd.Parameters.AddWithValue("@Content", body.content);

                        await conn.OpenAsync();

                        int newReviewId = (int)await cmd.ExecuteScalarAsync();
                        return newReviewId;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error writing review: {ex.Message}");
                return -1;
            }
        }
    }
}
