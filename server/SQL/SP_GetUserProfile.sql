USE [igroup179_prod]
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'SP_GetUserProfile')
    DROP PROCEDURE [dbo].[SP_GetUserProfile]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_GetUserProfile]
    @UserId int
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Get user profile with formatted photo data
        SELECT 
            u.Id,
            u.Username,
            u.Email,
            u.FavoriteAnimal,
            CASE 
                WHEN p.ProfilePhoto IS NOT NULL 
                THEN 'data:image/jpeg;base64,' + p.ProfilePhoto 
                ELSE NULL 
            END as ProfilePhoto
        FROM Users u
        LEFT JOIN Profile p ON u.Id = p.UserId
        WHERE u.Id = @UserId;

        RETURN 0;
    END TRY
    BEGIN CATCH
        -- Log the error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
        RETURN -1;
    END CATCH;
END
GO 