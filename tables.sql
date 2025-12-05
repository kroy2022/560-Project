/* ============================================================
   TABLES.SQL  –  Bookflix Database Schema
   ============================================================ */

-- NOTE: All FKs added below via ALTER


/* =======================
   USERS
   ======================= */
CREATE TABLE dbo.Users (
    UserID      INT             IDENTITY(1,1)    NOT NULL,
    FirstName   VARCHAR(50)     NOT NULL,
    LastName    VARCHAR(50)     NOT NULL,
    Email       VARCHAR(255)    NOT NULL,
    Password    NVARCHAR(255)   NOT NULL,
    CONSTRAINT PK_Users PRIMARY KEY (UserID),
    CONSTRAINT UQ_Users_Email UNIQUE (Email)
);
GO


/* =======================
   AUTHORS
   ======================= */
CREATE TABLE dbo.Authors (
    AuthorID    INT             IDENTITY(1,1)    NOT NULL,
    FirstName   VARCHAR(50)     NOT NULL,
    LastName    VARCHAR(50)     NOT NULL,
    Description NVARCHAR(MAX)   NOT NULL,
    CoverImage  NVARCHAR(500)   NULL,
    CONSTRAINT PK_Authors PRIMARY KEY (AuthorID)
);
GO


/* =======================
   GENRES
   ======================= */
CREATE TABLE dbo.Genres (
    GenreID INT              IDENTITY(1,1)   NOT NULL,
    Name    VARCHAR(100)     NOT NULL,
    CONSTRAINT PK_Genres PRIMARY KEY (GenreID),
    CONSTRAINT UQ_Genres_Name UNIQUE (Name)
);
GO


/* =======================
   BOOKS
   ======================= */
CREATE TABLE dbo.Books (
    BookID          INT             IDENTITY(1,1)    NOT NULL,
    ISBN            CHAR(13)        NOT NULL,
    Title           VARCHAR(255)    NOT NULL,
    Description     NVARCHAR(MAX)   NOT NULL,
    PublicationDate DATE            NULL,
    GenreID         INT             NULL,
    AuthorID        INT             NULL,
    CoverImage      NVARCHAR(500)   NOT NULL,
    Publisher       NVARCHAR(255)   NOT NULL,
    CONSTRAINT PK_Books PRIMARY KEY (BookID),
    CONSTRAINT UQ_Books_ISBN UNIQUE (ISBN)

);
GO


/* =======================
   REVIEWS
   ======================= */
CREATE TABLE dbo.Reviews (
    ReviewID    INT             IDENTITY(1,1)    NOT NULL,
    UserID      INT             NOT NULL,
    BookID      INT             NOT NULL,
    Rating      TINYINT         NOT NULL,
    Content     TEXT            NOT NULL,
    ReviewDate  DATETIME        NOT NULL
        CONSTRAINT DF_Reviews_ReviewDate DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT PK_Reviews PRIMARY KEY (ReviewID),
    -- each user can review a given book at most once
    CONSTRAINT UQ_Review_User_Book UNIQUE (UserID, BookID)
);
GO


/* =======================
   SAVEDBOOKS
   ======================= */
CREATE TABLE dbo.SavedBooks (
    SavedBookID INT NOT NULL IDENTITY(1,1),
    UserID      INT NOT NULL,
    BookID      INT NOT NULL,
    CONSTRAINT PK_SavedBooks PRIMARY KEY (SavedBookID)
    -- (you *could* also add UNIQUE(UserID, BookID) here if desired)
);
GO


/* ============================================================
   FOREIGN KEYS & CHECK CONSTRAINTS
   ============================================================ */

-- BOOKS to GENRES (many books per genre)
ALTER TABLE dbo.Books
ADD CONSTRAINT FK_Books_Genres
    FOREIGN KEY (GenreID) REFERENCES dbo.Genres (GenreID);
GO

-- BOOKS to AUTHORS (many books per author)
ALTER TABLE dbo.Books
ADD CONSTRAINT FK_Books_Authors
    FOREIGN KEY (AuthorID) REFERENCES dbo.Authors (AuthorID);
GO

-- REVIEWS to USERS (many reviews per user)
ALTER TABLE dbo.Reviews
ADD CONSTRAINT FK_Reviews_Users
    FOREIGN KEY (UserID) REFERENCES dbo.Users (UserID);
GO

-- REVIEWS to BOOKS (many reviews per book)
ALTER TABLE dbo.Reviews
ADD CONSTRAINT FK_Reviews_Books
    FOREIGN KEY (BookID) REFERENCES dbo.Books (BookID);
GO

-- SAVEDBOOKS to USERS
ALTER TABLE dbo.SavedBooks
ADD CONSTRAINT FK_SavedBooks_Users
    FOREIGN KEY (UserID) REFERENCES dbo.Users (UserID);
GO

-- SAVEDBOOKS to BOOKS
ALTER TABLE dbo.SavedBooks
ADD CONSTRAINT FK_SavedBooks_Books
    FOREIGN KEY (BookID) REFERENCES dbo.Books (BookID);
GO

-- Unique constraint to prevent duplicate saved items
ALTER TABLE dbo.SavedBooks
ADD CONSTRAINT UQ_SavedBooks_User_Book
    UNIQUE (UserID, BookID);
GO