USE [igroup179_prod]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'SP_AddNewUser')
    DROP PROCEDURE [dbo].[SP_AddNewUser]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_AddNewUser]
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

    -- Return the user
    SELECT 
        Id,
        Username,
        PasswordHash,
        Email,
        FavoriteAnimal,
        ProfilePhoto
    FROM Users
    WHERE Id = @NewUserID;
END
GO 