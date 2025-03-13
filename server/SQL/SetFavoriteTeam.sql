USE [F1ProjectDb]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'SetFavoriteTeam')
    DROP PROCEDURE [dbo].[SetFavoriteTeam]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SetFavoriteTeam]
    @UserId int,
    @TeamId int
AS
BEGIN
    -- Check if this team is already a favorite
    IF EXISTS (SELECT 1 FROM FavoriteTeams WHERE UserId = @UserId AND TeamId = @TeamId)
    BEGIN
        -- If it is, remove it
        DELETE FROM FavoriteTeams
        WHERE UserId = @UserId AND TeamId = @TeamId;
    END
    ELSE
    BEGIN
        -- Remove any existing favorite team and add the new one
        DELETE FROM FavoriteTeams
        WHERE UserId = @UserId;
        
        -- Add the new favorite team
        INSERT INTO FavoriteTeams (UserId, TeamId)
        VALUES (@UserId, @TeamId);
    END;
END;
GO 