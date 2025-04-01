USE [igroup179_prod]
GO

-- Drop existing foreign key constraints if they exist
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_FavoriteTeams_Users')
    ALTER TABLE FavoriteTeams DROP CONSTRAINT FK_FavoriteTeams_Users;

IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_FavoriteDrivers_Users')
    ALTER TABLE FavoriteDrivers DROP CONSTRAINT FK_FavoriteDrivers_Users;

IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_FavoriteRacingSpots_Users')
    ALTER TABLE FavoriteRacingSpots DROP CONSTRAINT FK_FavoriteRacingSpots_Users;

-- Recreate foreign key constraints with CASCADE DELETE
ALTER TABLE FavoriteTeams
ADD CONSTRAINT FK_FavoriteTeams_Users
FOREIGN KEY (UserId) REFERENCES Users(Id)
ON DELETE CASCADE;

ALTER TABLE FavoriteDrivers
ADD CONSTRAINT FK_FavoriteDrivers_Users
FOREIGN KEY (UserId) REFERENCES Users(Id)
ON DELETE CASCADE;

ALTER TABLE FavoriteRacingSpots
ADD CONSTRAINT FK_FavoriteRacingSpots_Users
FOREIGN KEY (UserId) REFERENCES Users(Id)
ON DELETE CASCADE;
GO 