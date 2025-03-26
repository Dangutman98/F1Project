USE [igroup179_prod]
GO

-- First, create Profile table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'U' AND name = 'Profile')
BEGIN
    CREATE TABLE [dbo].[Profile] (
        UserId INT PRIMARY KEY,
        ProfilePhoto NVARCHAR(MAX),
        FOREIGN KEY (UserId) REFERENCES Users(Id)
    )
END
GO

-- Drop the existing procedure if it exists
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'SP_UpdateProfilePhoto')
    DROP PROCEDURE [dbo].[SP_UpdateProfilePhoto]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_UpdateProfilePhoto]
    @UserId int,
    @ProfilePhoto nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
            -- Delete existing profile if exists
            IF EXISTS (SELECT 1 FROM Profile WHERE UserId = @UserId)
            BEGIN
                DELETE FROM Profile WHERE UserId = @UserId;
            END

            -- Insert new profile
            INSERT INTO Profile (UserId, ProfilePhoto)
            VALUES (@UserId, @ProfilePhoto);

            -- Return the updated profile photo with prefix
            SELECT 
                CASE 
                    WHEN @ProfilePhoto IS NOT NULL 
                    THEN 'data:image/jpeg;base64,' + @ProfilePhoto 
                    ELSE NULL 
                END as ProfilePhoto;

        COMMIT TRANSACTION;
        RETURN 0;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        -- Log the error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
        RETURN -1;
    END CATCH;
END
GO 