/* 04_kaggle_pipeline.sql
   Purpose: Show the SQL used to transform the Kaggle dataset
   (books_curated.csv) from staging table KaggleBooksRaw into
   the final Authors and Books tables.
*/

------------------------------------------------------------
-- 1. KaggleBooksRaw staging
------------------------------------------------------------
-- NOTE: books_curated.csv was imported into dbo.KaggleBooksRaw
-- using SQL Server import wizard / external tools.
-- Columns (example): ISBN, Title, BookAuthor, Publisher, Year, ...

------------------------------------------------------------
-- 2. Insert Authors from Kaggle (distinct BookAuthor)
------------------------------------------------------------
WITH DistinctAuthors AS (
    SELECT DISTINCT
        LTRIM(RTRIM(BookAuthor)) AS FullName
    FROM dbo.KaggleBooksRaw
    WHERE BookAuthor IS NOT NULL
      AND LTRIM(RTRIM(BookAuthor)) <> ''
),
SplitNames AS (
    SELECT
        FullName,
        -- naive split: last word = last name, rest = first name
        LEFT(FullName, LEN(FullName) - CHARINDEX(' ', REVERSE(FullName))) AS FirstName,
        RIGHT(FullName, CHARINDEX(' ', REVERSE(FullName)) - 1)           AS LastName
    FROM DistinctAuthors
)
INSERT INTO dbo.Authors (FirstName, LastName, Description, CoverImage)
SELECT
    s.FirstName,
    s.LastName,
    'Biography not available yet.',   -- later overwritten by Python
    'bad'                             -- placeholder; overwritten by Dicebear
FROM SplitNames s
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.Authors a
    WHERE a.FirstName = s.FirstName
      AND a.LastName  = s.LastName
);

------------------------------------------------------------
-- 3. Insert Books from Kaggle into Books table (deduped ISBN)
------------------------------------------------------------

;WITH Cleaned AS (
    SELECT
        LTRIM(RTRIM(ISBN))  AS CleanISBN,
        Title,
        BookAuthor,
        Publisher,
        Year
    FROM dbo.KaggleBooksRaw
    WHERE ISBN IS NOT NULL
      AND LTRIM(RTRIM(ISBN)) <> ''
),
Deduped AS (
    SELECT
        CleanISBN,
        Title,
        BookAuthor,
        Publisher,
        Year,
        ROW_NUMBER() OVER (PARTITION BY CleanISBN ORDER BY Title) AS rn
    FROM Cleaned
)
INSERT INTO dbo.Books (ISBN, Title, Description, PublicationDate, GenreID, AuthorID, CoverImage, Publisher)
SELECT
    d.CleanISBN,
    d.Title,
    'Description not available yet.',   -- later overwritten by Python
    TRY_CONVERT(date, CONCAT(d.Year, '-01-01')),
    NULL,                               -- genre assigned later by auto_assign_genres.py
    a.AuthorID,
    'bad',                              -- placeholder; overwritten by validate_and_fix_covers_v2.py
    d.Publisher
FROM Deduped d
JOIN dbo.Authors a
    ON a.FirstName + ' ' + a.LastName = d.BookAuthor
WHERE d.rn = 1  -- only one per ISBN
  AND NOT EXISTS (
      SELECT 1 FROM dbo.Books b WHERE b.ISBN = d.CleanISBN
  );
