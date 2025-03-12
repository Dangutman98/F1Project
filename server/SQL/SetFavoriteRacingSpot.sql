USE [F1ProjectDb]
GO

-- Drop the stored procedure if it already exists
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'SetFavoriteRacingSpot')
    DROP PROCEDURE [dbo].[SetFavoriteRacingSpot]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SetFavoriteRacingSpot]
    @UserId int,
    @SpotName nvarchar(255)
AS
BEGIN
    -- Since UserId and SpotName form a composite primary key, we don't need to delete first
    -- If the combination already exists, it won't insert due to PK constraint
    -- If it's a new combination, it will insert
    IF NOT EXISTS (SELECT 1 FROM FavoriteRacingSpots WHERE UserId = @UserId AND SpotName = @SpotName)
    BEGIN
        INSERT INTO FavoriteRacingSpots (UserId, SpotName)
        VALUES (@UserId, @SpotName);
    END
END; 