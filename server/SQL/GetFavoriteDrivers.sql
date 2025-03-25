USE [igroup179_prod]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetFavoriteDrivers')
    DROP PROCEDURE [dbo].[GetFavoriteDrivers]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetFavoriteDrivers]
    @UserId int
AS
BEGIN
    SELECT DriverId
    FROM FavoriteDrivers
    WHERE UserId = @UserId;
END;
GO 