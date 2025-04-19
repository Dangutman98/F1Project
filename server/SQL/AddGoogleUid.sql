USE [igroup179_prod]
GO

-- Add GoogleUid column back to Users table
IF NOT EXISTS (
    SELECT * 
    FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Users]') 
    AND name = 'GoogleUid'
)
BEGIN
    ALTER TABLE [dbo].[Users]
    ADD GoogleUid NVARCHAR(255) NULL;
END

-- Drop and recreate the view to include GoogleUid
IF EXISTS (SELECT * FROM sys.views WHERE name = 'UsersOrdered')
BEGIN
    DROP VIEW UsersOrdered;
END
GO

CREATE VIEW UsersOrdered AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY Id) AS SequentialID,
    Id,
    Username,
    PasswordHash,
    Email,
    FavoriteAnimal,
    ProfilePhoto,
    GoogleUid
FROM Users;
GO

-- Update the SP_AddNewUser stored procedure
ALTER PROCEDURE [dbo].[SP_AddNewUser]
    @Username NVARCHAR(100),
    @PasswordHash NVARCHAR(MAX),
    @Email NVARCHAR(100),
    @FavoriteAnimal NVARCHAR(50) = NULL,
    @ProfilePhoto NVARCHAR(MAX) = NULL,
    @NewUserID INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- Insert the new user
    INSERT INTO Users (
        Username,
        PasswordHash,
        Email,
        FavoriteAnimal,
        ProfilePhoto
    )
    VALUES (
        @Username,
        @PasswordHash,
        @Email,
        ISNULL(@FavoriteAnimal, 'Not Set'),
        @ProfilePhoto
    );

    -- Get the newly inserted user's actual ID
    SET @NewUserID = SCOPE_IDENTITY();

    -- Return the user with sequential ordering
    SELECT 
        SequentialID,
        Id,
        Username,
        PasswordHash,
        Email,
        FavoriteAnimal,
        ProfilePhoto,
        GoogleUid
    FROM UsersOrdered
    WHERE Id = @NewUserID;
END
GO 