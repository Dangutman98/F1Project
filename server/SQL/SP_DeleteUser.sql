USE [igroup179_prod]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'SP_DeleteUser')
    DROP PROCEDURE [dbo].[SP_DeleteUser]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_DeleteUser]
    @UserID INT
AS
BEGIN
    -- Delete from FavoriteTeams first
    DELETE FROM FavoriteTeams WHERE UserId = @UserID;
    DELETE FROM FavoriteDrivers WHERE UserId = @UserID;
    DELETE FROM FavoriteRacingSpots WHERE UserId = @UserID;
    
    -- Then delete the user
    DELETE FROM Users WHERE Id = @UserID;

    -- Get the max ID
    DECLARE @MaxID int;
    SELECT @MaxID = ISNULL(MAX(Id), 0) FROM Users;

    -- Reseed to the current max value
    DBCC CHECKIDENT ('Users', RESEED, @MaxID);
END
GO 