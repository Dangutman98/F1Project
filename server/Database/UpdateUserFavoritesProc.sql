-- First, drop the old GetUserFavorites procedure
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetUserFavorites')
BEGIN
    DROP PROCEDURE [dbo].[GetUserFavorites]
END

-- Then rename SP_GetUserFavorites to GetUserFavorites
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'SP_GetUserFavorites')
BEGIN
    -- We can't directly rename a stored procedure, so we need to:
    -- 1. Script out the existing SP_GetUserFavorites
    -- 2. Create it with the new name
    -- 3. Drop the old one
    
    EXEC sp_rename 'dbo.SP_GetUserFavorites', 'GetUserFavorites';
END 