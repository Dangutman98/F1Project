USE [igroup179_prod]
GO

-- Drop the existing view
IF EXISTS (SELECT * FROM sys.views WHERE name = 'UsersOrdered')
BEGIN
    DROP VIEW UsersOrdered;
END
GO

-- Create the view without GoogleUid
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