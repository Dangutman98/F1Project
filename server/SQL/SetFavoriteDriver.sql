USE [F1ProjectDb]
GO

-- First, let's drop and recreate the FavoriteDrivers table to include a timestamp
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'U' AND name = 'FavoriteDrivers')
    DROP TABLE [dbo].[FavoriteDrivers]
GO

CREATE TABLE [dbo].[FavoriteDrivers] (
    UserId INT,
    DriverId INT,
    AddedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (UserId, DriverId)
)
GO

-- Now create the stored procedure
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'SetFavoriteDriver')
    DROP PROCEDURE [dbo].[SetFavoriteDriver]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SetFavoriteDriver]
    @UserId int,
    @DriverId int
AS
BEGIN
    -- Check if this driver is already a favorite
    IF EXISTS (SELECT 1 FROM FavoriteDrivers WHERE UserId = @UserId AND DriverId = @DriverId)
    BEGIN
        -- If it is, remove it
        DELETE FROM FavoriteDrivers
        WHERE UserId = @UserId AND DriverId = @DriverId;
    END
    ELSE
    BEGIN
        -- Check how many favorites the user already has
        DECLARE @FavoriteCount int;
        SELECT @FavoriteCount = COUNT(*)
        FROM FavoriteDrivers
        WHERE UserId = @UserId;

        -- If already has 2 favorites, remove the oldest one based on AddedAt
        IF @FavoriteCount >= 2
        BEGIN
            DELETE FROM FavoriteDrivers
            WHERE UserId = @UserId
            AND AddedAt = (
                SELECT MIN(AddedAt)
                FROM FavoriteDrivers
                WHERE UserId = @UserId
            );
        END

        -- Add the new favorite driver with current timestamp
        INSERT INTO FavoriteDrivers (UserId, DriverId)
        VALUES (@UserId, @DriverId);
    END;
END;
GO 