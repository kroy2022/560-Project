/* ============================================================
   Procedures.sql – Bookflix SQL Operations
   Every procedure below corresponds directly to a query used
   in the backend code (numbers 1–19 as listed).
   ============================================================ */

---------------------------------------------------------------
-- 18 & 1 (part): ValidateSignIn(SignInBody body)
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Auth_ValidateSignIn
    @Email    VARCHAR(255),
    @Password NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT UserID, FirstName, LastName
    FROM Users
    WHERE Email = @Email
      AND Password = @Password;
END;
GO


---------------------------------------------------------------
-- 19: CreateUser(SignUpBody body)
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Auth_CreateUser
    @Email     VARCHAR(255),
    @FirstName VARCHAR(50),
    @LastName  VARCHAR(50),
    @Password  NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Users (Email, FirstName, LastName, Password) 
    VALUES (@Email, @FirstName, @LastName, @Password);

    SELECT CAST(SCOPE_IDENTITY() AS INT) AS NewUserID;
END;
GO


/* ============================================================
   AUTHORS / AUTHOR AGGREGATIONS
   ============================================================ */

---------------------------------------------------------------
-- 1 (part): GetAllAuthors() - authorsQuery
-- Aggregation query: authors with average rating
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Authors_GetAllAuthors
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        a.AuthorID,
        a.FirstName + ' ' + a.LastName AS AuthorName,
        a.CoverImage,
        AVG(r.Rating) AS AvgRating
    FROM Authors a
    JOIN Books b
        ON a.AuthorID = b.AuthorID
    LEFT JOIN Reviews r 
        ON b.BookID = r.BookID
    GROUP BY 
        a.AuthorID,
        a.FirstName,
        a.LastName,
        a.CoverImage
    ORDER BY 
        AvgRating DESC;
END;
GO


---------------------------------------------------------------
-- 1 (part): GetAllAuthors() - authorInformationQuery
-- Global stats: total distinct genres, total books
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Authors_GetLibraryStats
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        COUNT(DISTINCT b.GenreID) AS totalGenres,
        COUNT(DISTINCT b.BookID)  AS totalBooks
    FROM Books b;
END;
GO


---------------------------------------------------------------
-- 2: GetAuthorInfo(int authorId) - authorInfoQuery
-- Aggregation: author details, total books, average rating
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Authors_GetAuthorInfo
    @AuthorID INT
AS
BEGIN
    SET NOCOUNT ON;

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
END;
GO


---------------------------------------------------------------
-- 3: genreInfoQuery (used inside GetAuthorInfo)
-- Get distinct genres that an author has written in
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Authors_GetGenresForAuthor
    @AuthorID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT DISTINCT
        g.Name
    FROM Genres g
    JOIN Books b
        ON g.GenreID = b.GenreID
    WHERE b.AuthorID = @AuthorID;
END;
GO


/* ============================================================
   BOOK DETAILS / PER-BOOK OPERATIONS
   ============================================================ */

---------------------------------------------------------------
-- 4: GetBookInformation(int bookId, int userId)
-- Includes isSaved flag for the given user
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Books_GetBookInformation
    @BookID INT,
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;

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
    WHERE b.BookID = @BookID;
END;
GO


---------------------------------------------------------------
-- 5: GetBookReviews(int bookId)
-- Reviews + user names for a book
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Books_GetBookReviews
    @BookID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        r.ReviewID AS reviewId,
        u.UserID AS userId,
        u.FirstName + ' ' + u.LastName AS userName,
        r.Rating AS rating,
        r.Content AS content, 
        r.ReviewDate AS reviewDate
    FROM Reviews r
    JOIN Users u 
        ON r.UserID = u.UserID
    WHERE r.BookID = @BookID
    ORDER BY r.ReviewDate DESC;
END;
GO


---------------------------------------------------------------
-- 6: GetSimilarBooks(string genre, string author, int bookId)
-- CTE-based similar-books: 5 by author + 5 by genre, up to 10 total
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Books_GetSimilarBooks
    @Genre  VARCHAR(100),
    @Author NVARCHAR(200),
    @BookID INT
AS
BEGIN
    SET NOCOUNT ON;

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
END;
GO


---------------------------------------------------------------
-- 7: GetBooksForAuthor(int authorId)
-- All books by given author (id, title, cover, author name)
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Books_GetBooksForAuthor
    @AuthorID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        b.BookID,
        b.Title,
        b.CoverImage,
        a.FirstName + ' ' + a.LastName AS Author
    FROM Books b
    JOIN Authors a
        ON b.AuthorID = a.AuthorID
    WHERE b.AuthorID = @AuthorID;
END;
GO


---------------------------------------------------------------
-- 8: GetBooksFromGenre(int genreId)
-- All books in a genre (id, title, cover, author, genre name)
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Books_GetBooksFromGenre
    @GenreID INT
AS
BEGIN
    SET NOCOUNT ON;

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
    WHERE b.GenreID = @GenreID;
END;
GO


---------------------------------------------------------------
-- 9: GetBooks()
-- All books (id, title, cover, author)
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Books_GetAllBooks
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        b.BookID,
        b.Title,
        b.CoverImage,
        a.FirstName + ' ' + a.LastName AS Author
    FROM Books b
    JOIN Authors a
        ON b.AuthorID = a.AuthorID;
END;
GO


---------------------------------------------------------------
-- 10: WriteReview(WriteReviewBody body)
-- Insert a review and return new ReviewID
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Books_WriteReview
    @UserID  INT,
    @BookID  INT,
    @Rating  TINYINT,
    @Content NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Reviews (UserID, BookID, Rating, Content)
    VALUES (@UserID, @BookID, @Rating, @Content);

    SELECT CAST(SCOPE_IDENTITY() AS INT) AS NewReviewID;
END;
GO


/* ============================================================
   DASHBOARD / POPULAR / FEATURED / SAVED & GENRE ROWS
   ============================================================ */

---------------------------------------------------------------
-- 11: GetFeaturedBook()
-- TOP 1 book by average rating
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Dashboard_GetFeaturedBook
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
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
    ORDER BY avg_ratings.AvgRating DESC;
END;
GO


---------------------------------------------------------------
-- 12: GetPopularBooks()
-- TOP 9 books by avg rating & total reviews
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Dashboard_GetPopularBooks
AS
BEGIN
    SET NOCOUNT ON;

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
END;
GO


---------------------------------------------------------------
-- 13: GetSavedBooks(SavedBooksBody body)
-- All books saved by a user
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Dashboard_GetSavedBooks
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        b.BookID, 
        b.ISBN, 
        b.Title, 
        b.Description, 
        b.PublicationDate, 
        b.CoverImage, 
        a.FirstName + ' ' + a.LastName AS Author, 
        g.Name AS genre
    FROM Books b 
    JOIN SavedBooks sb 
        ON b.BookID = sb.BookID 
        AND sb.UserID = @UserID 
    JOIN Authors a 
        ON b.AuthorID = a.AuthorID 
    JOIN Genres g 
        ON b.GenreID = g.GenreID;
END;
GO


---------------------------------------------------------------
-- 14: GetGenreRows()
-- For each genre, returns a JSON array of up to 15 books
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Dashboard_GetGenreRows
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        g.GenreID, 
        g.Name, 
        (
            SELECT TOP 15 
                b.BookID AS bookId, 
                b.ISBN AS isbn, 
                b.Title AS title, 
                b.CoverImage AS coverImage, 
                b.Description AS description, 
                b.PublicationDate AS publicationDate, 
                a.FirstName + ' ' + a.LastName AS author 
            FROM Books b 
            JOIN Authors a 
                ON b.AuthorID = a.AuthorID 
            WHERE b.GenreID = g.GenreID 
            ORDER BY b.BookID 
            FOR JSON PATH
        ) AS genreBooks 
    FROM Genres g;
END;
GO


---------------------------------------------------------------
-- 15: GetGenreBooksWithOffset(int genreId, int offset)
-- Paged list of genre books as JSON
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Dashboard_GetGenreBooksWithOffset
    @GenreID INT,
    @Offset  INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        b.BookID, 
        b.ISBN, 
        b.Title, 
        b.Description, 
        b.PublicationDate, 
        b.CoverImage, 
        a.FirstName + ' ' + a.LastName AS Author 
    FROM Books b 
    JOIN Authors a 
        ON b.AuthorID = a.AuthorID 
    WHERE b.GenreID = @GenreID 
    ORDER BY b.BookID 
    OFFSET @Offset ROWS 
    FETCH NEXT 10 ROWS ONLY 
    FOR JSON PATH;
END;
GO


/* ============================================================
   SEARCH
   ============================================================ */

---------------------------------------------------------------
-- 17: GetSearchResults(string searchQuery)
-- Search by title, author name, genre, or publisher
---------------------------------------------------------------
CREATE OR ALTER PROCEDURE dbo.sp_Search_GetSearchResults
    @SearchQuery NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
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
    WHERE b.Title LIKE '%' + @SearchQuery + '%' 
       OR a.FirstName + ' ' + a.LastName LIKE '%' + @SearchQuery + '%' 
       OR g.Name LIKE '%' + @SearchQuery + '%' 
       OR b.Publisher LIKE '%' + @SearchQuery + '%' 
    ORDER BY b.BookID;
END;
GO
