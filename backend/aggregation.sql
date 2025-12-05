-- Query 1: This query gets all the authors and their average ratings
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

-- Query 2: This query gets all information tied to a specific author given an AuthorID
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

-- Query 3: This query gets similar books to a selected book by finding 5 with the same author and 5 in the same genre and merging them
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

-- Question 4: This query gets the most popular books in the database sorting by their average rating AND total reviews
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