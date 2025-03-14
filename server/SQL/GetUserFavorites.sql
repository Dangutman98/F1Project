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

    -- Get favorite drivers with details
    SELECT 
        CAST(d.Id as int) as DriverId,
        ISNULL(d.Name, '') as DriverName,
        ISNULL(d.PhotoURL, '') as PhotoURL,
        CAST(ISNULL(d.TeamId, 0) as int) as TeamId,
        ISNULL(d.AcronymName, '') as AcronymName,
        ISNULL(t.Name, '') as TeamName,
        ISNULL(t.Color, '') as TeamColor
    FROM FavoriteDrivers fd
    INNER JOIN Drivers d ON fd.DriverId = d.Id
    LEFT JOIN Teams t ON d.TeamId = t.Id
    WHERE fd.UserId = @UserId;

    -- Get favorite teams with details
    SELECT 
        CAST(t.Id as int) as TeamId,
        ISNULL(t.Name, '') as TeamName,
        ISNULL(t.Color, '') as Color
    FROM FavoriteTeams ft
    INNER JOIN Teams t ON ft.TeamId = t.Id
    WHERE ft.UserId = @UserId;

    -- Get favorite racing spots
    SELECT ISNULL(SpotName, '')
    FROM FavoriteRacingSpots
    WHERE UserId = @UserId;
END;
GO 