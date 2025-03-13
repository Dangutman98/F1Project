USE [F1ProjectDb]
GO

-- First, create the FavoriteRacingSpots table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'U' AND name = 'FavoriteRacingSpots')
BEGIN
    CREATE TABLE [dbo].[FavoriteRacingSpots] (
        UserId INT,
        SpotName NVARCHAR(255),
        PRIMARY KEY (UserId, SpotName)
    )
END
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
    -- Check if this spot is already a favorite
    IF EXISTS (SELECT 1 FROM FavoriteRacingSpots WHERE UserId = @UserId AND SpotName = @SpotName)
    BEGIN
        -- If it is, remove it
        DELETE FROM FavoriteRacingSpots
        WHERE UserId = @UserId AND SpotName = @SpotName;
    END
    ELSE
    BEGIN
        -- Add the new favorite spot
        INSERT INTO FavoriteRacingSpots (UserId, SpotName)
        VALUES (@UserId, @SpotName);
    END
END; 