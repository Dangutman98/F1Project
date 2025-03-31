USE [igroup179_prod]
GO

-- First, create Profile table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'U' AND name = 'Profile')
BEGIN
    CREATE TABLE [dbo].[Profile] (
        UserId INT PRIMARY KEY,
        ProfilePhoto NVARCHAR(MAX),
        FOREIGN KEY (UserId) REFERENCES Users(Id)
    )
END
GO

-- Drop the existing procedure if it exists
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'SP_UpdateProfilePhoto')
    DROP PROCEDURE [dbo].[SP_UpdateProfilePhoto]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE SP_UpdateProfilePhoto
    @UserId INT,
    @ProfilePhoto NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Users
    SET ProfilePhoto = @ProfilePhoto
    WHERE Id = @UserId;

    SELECT ProfilePhoto
    FROM Users
    WHERE Id = @UserId;
END
GO 