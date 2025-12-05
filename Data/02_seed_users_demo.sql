/* 02_seed_users_demo.sql
   Purpose: Insert demo users used by the system (for reviews, saved books, etc.).
*/

IF NOT EXISTS (SELECT 1 FROM dbo.Users)
BEGIN
    DECLARE @i INT = 1;

    WHILE @i <= 50
    BEGIN
        INSERT INTO dbo.Users (FirstName, LastName, Email, Password)
        VALUES (
            CONCAT('User', @i),              -- FirstName
            'Demo',                          -- LastName
            CONCAT('user', @i, '@bookflix.demo'),  -- Email
            'Password123!'                   -- Password
        );

        SET @i += 1;
    END;
END;
