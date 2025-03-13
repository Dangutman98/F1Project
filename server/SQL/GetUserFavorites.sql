USE [F1ProjectDb]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetUserFavorites')
    DROP PROCEDURE [dbo].[GetUserFavorites]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetUserFavorites]
    @UserId int
AS
BEGIN
    SET NOCOUNT ON;

    -- Get favorite drivers
    SELECT DriverId
    FROM FavoriteDrivers
    WHERE UserId = @UserId;

    -- Get favorite teams
    SELECT TeamId
    FROM FavoriteTeams
    WHERE UserId = @UserId;

    -- Get favorite racing spots
    SELECT SpotName
    FROM FavoriteRacingSpots
    WHERE UserId = @UserId;
END;
GO 