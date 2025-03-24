CREATE PROCEDURE [dbo].[SP_InsertDriverStandings2024]
    @DriverId INT,
    @Position INT,
    @Points INT,
    @GapToLeader NVARCHAR(50),
    @TeamId INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [dbo].[DriverStandings2024]
        (DriverId, Position, Points, GapToLeader, TeamId)
    VALUES
        (@DriverId, @Position, @Points, @GapToLeader, @TeamId)
END 