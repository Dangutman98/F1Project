USE [igroup179_prod]
GO

-- First, drop the UsersOrdered view if it exists (since it references GoogleUid)
IF EXISTS (SELECT * FROM sys.views WHERE name = 'UsersOrdered')
BEGIN
    DROP VIEW UsersOrdered;
END

-- Remove GoogleUid column from Users table
IF EXISTS (
    SELECT * 
    FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Users]') 
    AND name = 'GoogleUid'
)
BEGIN
    ALTER TABLE [dbo].[Users]
    DROP COLUMN GoogleUid;
END

-- Recreate the UsersOrdered view without GoogleUid
CREATE VIEW UsersOrdered AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY Id) AS SequentialID,
    Id,
    Username,
    PasswordHash,
    Email,
    FavoriteAnimal,
    ProfilePhoto
FROM Users;
GO 