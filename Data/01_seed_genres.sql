/* 01_seed_genres.sql
   Purpose: Insert initial genres used by Bookflix.
*/

SET IDENTITY_INSERT dbo.Genres ON;

IF NOT EXISTS (SELECT 1 FROM dbo.Genres WHERE GenreID = 1)
BEGIN
    INSERT INTO dbo.Genres (GenreID, Name)
    VALUES (1, 'Science Fiction');
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Genres WHERE GenreID = 2)
BEGIN
    INSERT INTO dbo.Genres (GenreID, Name)
    VALUES (2, 'Fantasy');
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Genres WHERE GenreID = 3)
BEGIN
    INSERT INTO dbo.Genres (GenreID, Name)
    VALUES (3, 'Mystery');
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Genres WHERE GenreID = 4)
BEGIN
    INSERT INTO dbo.Genres (GenreID, Name)
    VALUES (4, 'Romance');
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Genres WHERE GenreID = 5)
BEGIN
    INSERT INTO dbo.Genres (GenreID, Name)
    VALUES (5, 'Non-Fiction');
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Genres WHERE GenreID = 6)
BEGIN
    INSERT INTO dbo.Genres (GenreID, Name)
    VALUES (6, 'Horror');
END;

SET IDENTITY_INSERT dbo.Genres OFF;
