CREATE PROCEDURE [dbo].[SP_UpdateProfilePhoto]
    @UserId int,
    @ProfilePhoto nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Users
    SET ProfilePhoto = @ProfilePhoto
    WHERE Id = @UserId;

    RETURN 0;
END 