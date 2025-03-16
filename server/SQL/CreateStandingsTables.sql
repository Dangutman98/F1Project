-- Create DriverStandings table
CREATE TABLE DriverStandings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    DriverId INT NOT NULL,
    Position INT NOT NULL,
    Points DECIMAL(6,2) NOT NULL,
    Wins INT NOT NULL DEFAULT 0,
    Season INT NOT NULL,
    LastUpdated DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (DriverId) REFERENCES Drivers(Id)
);

-- Create ConstructorStandings table
CREATE TABLE ConstructorStandings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TeamId INT NOT NULL,
    Position INT NOT NULL,
    Points DECIMAL(6,2) NOT NULL,
    Wins INT NOT NULL DEFAULT 0,
    Season INT NOT NULL,
    LastUpdated DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (TeamId) REFERENCES Teams(Id)
);

-- Create stored procedure to update driver standings
CREATE OR ALTER PROCEDURE SP_UpdateDriverStandings
    @DriverId INT,
    @Position INT,
    @Points DECIMAL(6,2),
    @Wins INT,
    @Season INT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM DriverStandings WHERE DriverId = @DriverId AND Season = @Season)
    BEGIN
        UPDATE DriverStandings
        SET Position = @Position,
            Points = @Points,
            Wins = @Wins,
            LastUpdated = GETDATE()
        WHERE DriverId = @DriverId AND Season = @Season
    END
    ELSE
    BEGIN
        INSERT INTO DriverStandings (DriverId, Position, Points, Wins, Season)
        VALUES (@DriverId, @Position, @Points, @Wins, @Season)
    END
END;

-- Create stored procedure to update constructor standings
CREATE OR ALTER PROCEDURE SP_UpdateConstructorStandings
    @TeamId INT,
    @Position INT,
    @Points DECIMAL(6,2),
    @Wins INT,
    @Season INT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM ConstructorStandings WHERE TeamId = @TeamId AND Season = @Season)
    BEGIN
        UPDATE ConstructorStandings
        SET Position = @Position,
            Points = @Points,
            Wins = @Wins,
            LastUpdated = GETDATE()
        WHERE TeamId = @TeamId AND Season = @Season
    END
    ELSE
    BEGIN
        INSERT INTO ConstructorStandings (TeamId, Position, Points, Wins, Season)
        VALUES (@TeamId, @Position, @Points, @Wins, @Season)
    END
END;

-- Create stored procedure to get driver standings
CREATE OR ALTER PROCEDURE SP_GetDriverStandings
    @Season INT
AS
BEGIN
    SELECT 
        ds.Position,
        ds.Points,
        ds.Wins,
        d.Name as DriverName,
        d.AcronymName,
        t.Name as TeamName,
        t.Color as TeamColor
    FROM DriverStandings ds
    INNER JOIN Drivers d ON ds.DriverId = d.Id
    INNER JOIN Teams t ON d.TeamId = t.Id
    WHERE ds.Season = @Season
    ORDER BY ds.Position;
END;

-- Create stored procedure to get constructor standings
CREATE OR ALTER PROCEDURE SP_GetConstructorStandings
    @Season INT
AS
BEGIN
    SELECT 
        cs.Position,
        cs.Points,
        cs.Wins,
        t.Name as TeamName,
        t.Color as TeamColor
    FROM ConstructorStandings cs
    INNER JOIN Teams t ON cs.TeamId = t.Id
    WHERE cs.Season = @Season
    ORDER BY cs.Position;
END; 