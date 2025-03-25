USE [igroup179_prod]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetFavoriteTeams')
    DROP PROCEDURE [dbo].[GetFavoriteTeams]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetFavoriteTeams]
    @UserId int
AS
BEGIN
    SELECT TeamId
    FROM FavoriteTeams
    WHERE UserId = @UserId;
END;
GO 