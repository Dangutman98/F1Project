USE [master]
GO
/****** Object:  Database [igroup179_prod]    Script Date: 10/06/2025 16:46:14 ******/
CREATE DATABASE [igroup179_prod]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'igroup179_prod', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.PROJDB\MSSQL\DATA\igroup179_prod.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'igroup179_prod_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.PROJDB\MSSQL\DATA\igroup179prod_log.ldf' , SIZE = 9152KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [igroup179_prod] SET COMPATIBILITY_LEVEL = 130
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [igroup179_prod].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [igroup179_prod] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [igroup179_prod] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [igroup179_prod] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [igroup179_prod] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [igroup179_prod] SET ARITHABORT OFF 
GO
ALTER DATABASE [igroup179_prod] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [igroup179_prod] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [igroup179_prod] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [igroup179_prod] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [igroup179_prod] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [igroup179_prod] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [igroup179_prod] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [igroup179_prod] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [igroup179_prod] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [igroup179_prod] SET  ENABLE_BROKER 
GO
ALTER DATABASE [igroup179_prod] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [igroup179_prod] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [igroup179_prod] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [igroup179_prod] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [igroup179_prod] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [igroup179_prod] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [igroup179_prod] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [igroup179_prod] SET RECOVERY FULL 
GO
ALTER DATABASE [igroup179_prod] SET  MULTI_USER 
GO
ALTER DATABASE [igroup179_prod] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [igroup179_prod] SET DB_CHAINING OFF 
GO
ALTER DATABASE [igroup179_prod] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [igroup179_prod] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [igroup179_prod] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [igroup179_prod] SET QUERY_STORE = OFF
GO
USE [igroup179_prod]
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
USE [igroup179_prod]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 10/06/2025 16:46:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Username] [nvarchar](50) NOT NULL,
	[PasswordHash] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[FavoriteAnimal] [nvarchar](50) NOT NULL,
	[ProfilePhoto] [nvarchar](max) NULL,
	[Id] [int] IDENTITY(1,1) NOT NULL,
 CONSTRAINT [PK__Users__3214EC276C3184CF] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[UsersOrdered]    Script Date: 10/06/2025 16:46:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[UsersOrdered] AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY Id) AS SequentialID,
    Id,
    Username,
    PasswordHash,
    Email,
    FavoriteAnimal,
    ProfilePhoto,
    GoogleUid
FROM Users;

GO
/****** Object:  Table [dbo].[Drivers]    Script Date: 10/06/2025 16:46:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Drivers](
	[Name] [nvarchar](100) NOT NULL,
	[PhotoURL] [nvarchar](255) NULL,
	[TeamId] [nvarchar](50) NULL,
	[AcronymName] [nvarchar](10) NULL,
	[Id] [int] NOT NULL,
 CONSTRAINT [PK_Drivers_Id] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DriverStandings2023]    Script Date: 10/06/2025 16:46:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DriverStandings2023](
	[DriverId] [int] NOT NULL,
	[Position] [int] NOT NULL,
	[Points] [int] NOT NULL,
	[GapToLeader] [nvarchar](50) NOT NULL,
	[TeamId] [int] NOT NULL,
 CONSTRAINT [PK_DriverStandings2023] PRIMARY KEY CLUSTERED 
(
	[DriverId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DriverStandings2024]    Script Date: 10/06/2025 16:46:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DriverStandings2024](
	[DriverId] [int] NOT NULL,
	[Position] [int] NOT NULL,
	[Points] [int] NOT NULL,
	[GapToLeader] [nvarchar](50) NOT NULL,
	[TeamId] [int] NOT NULL,
 CONSTRAINT [PK_DriverStandings2024] PRIMARY KEY CLUSTERED 
(
	[DriverId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Events]    Script Date: 10/06/2025 16:46:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Events](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RaceName] [nvarchar](255) NOT NULL,
	[RaceDate] [datetime] NOT NULL,
	[Location] [nvarchar](255) NULL,
	[ImageUrl] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FavoriteDrivers]    Script Date: 10/06/2025 16:46:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FavoriteDrivers](
	[UserId] [int] NOT NULL,
	[DriverId] [int] NOT NULL,
	[AddedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[DriverId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FavoriteRacingSpots]    Script Date: 10/06/2025 16:46:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FavoriteRacingSpots](
	[UserId] [int] NOT NULL,
	[SpotName] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[SpotName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FavoriteTeams]    Script Date: 10/06/2025 16:46:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FavoriteTeams](
	[UserId] [int] NOT NULL,
	[TeamId] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Teams]    Script Date: 10/06/2025 16:46:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Teams](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Color] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Max VERSTAPPEN', N'https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/2col/image.png', N'1', N'VER', 1)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Logan SARGEANT', N'https://www.formula1.com/content/dam/fom-website/drivers/L/LOGSAR01_Logan_Sargeant/logsar01.png.transform/2col/image.png', N'2', N'SAR', 2)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Lando NORRIS', N'https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/2col/image.png', N'3', N'NOR', 4)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Pierre GASLY', N'https://www.formula1.com/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/2col/image.png', N'4', N'GAS', 10)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Sergio PEREZ', N'https://www.formula1.com/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/2col/image.png', N'1', N'PER', 11)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Fernando ALONSO', N'https://www.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/2col/image.png', N'5', N'ALO', 14)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Charles LECLERC', N'https://www.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/2col/image.png', N'6', N'LEC', 16)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Lance STROLL', N'https://www.formula1.com/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/2col/image.png', N'5', N'STR', 18)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Kevin MAGNUSSEN', N'https://www.formula1.com/content/dam/fom-website/drivers/K/KEVMAG01_Kevin_Magnussen/kevmag01.png.transform/2col/image.png', N'7', N'MAG', 20)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Nyck DE VRIES', N'https://www.formula1.com/content/dam/fom-website/drivers/N/NYCDEV01_Nyck_De%20Vries/nycdev01.png.transform/2col/image.png', N'8', N'DEV', 21)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Yuki TSUNODA', N'https://www.formula1.com/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png.transform/2col/image.png', N'8', N'TSU', 22)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Alexander ALBON', N'https://www.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/2col/image.png', N'2', N'ALB', 23)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'ZHOU Guanyu', N'https://www.formula1.com/content/dam/fom-website/drivers/G/GUAZHO01_Guanyu_Zhou/guazho01.png.transform/2col/image.png', N'9', N'ZHO', 24)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Nico HULKENBERG', N'https://www.formula1.com/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/2col/image.png', N'7', N'HUL', 27)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Esteban OCON', N'https://www.formula1.com/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/2col/image.png', N'4', N'OCO', 31)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Lewis HAMILTON', N'https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/2col/image.png', N'10', N'HAM', 44)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Carlos SAINZ', N'https://www.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/2col/image.png', N'6', N'SAI', 55)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'George RUSSELL', N'https://www.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/2col/image.png', N'10', N'RUS', 63)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Valtteri BOTTAS', N'https://www.formula1.com/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png.transform/2col/image.png', N'9', N'BOT', 77)
INSERT [dbo].[Drivers] ([Name], [PhotoURL], [TeamId], [AcronymName], [Id]) VALUES (N'Oscar PIASTRI', N'https://www.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/2col/image.png', N'3', N'PIA', 81)
GO
INSERT [dbo].[DriverStandings2023] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (1, 1, 575, N'—', 1)
INSERT [dbo].[DriverStandings2023] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (4, 6, 205, N'-370', 3)
INSERT [dbo].[DriverStandings2023] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (10, 11, 62, N'-513', 4)
INSERT [dbo].[DriverStandings2023] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (11, 2, 285, N'-290', 1)
INSERT [dbo].[DriverStandings2023] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (14, 4, 206, N'-369', 5)
INSERT [dbo].[DriverStandings2023] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (16, 5, 206, N'-369', 6)
INSERT [dbo].[DriverStandings2023] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (18, 10, 74, N'-501', 5)
INSERT [dbo].[DriverStandings2023] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (22, 14, 17, N'-558', 8)
INSERT [dbo].[DriverStandings2023] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (23, 13, 27, N'-548', 2)
INSERT [dbo].[DriverStandings2023] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (27, 16, 9, N'-566', 7)
INSERT [dbo].[DriverStandings2023] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (31, 12, 58, N'-517', 4)
INSERT [dbo].[DriverStandings2023] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (44, 3, 234, N'-341', 10)
INSERT [dbo].[DriverStandings2023] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (55, 7, 200, N'-375', 6)
INSERT [dbo].[DriverStandings2023] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (63, 8, 175, N'-400', 10)
INSERT [dbo].[DriverStandings2023] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (77, 15, 10, N'-565', 9)
INSERT [dbo].[DriverStandings2023] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (81, 9, 97, N'-478', 3)
GO
INSERT [dbo].[DriverStandings2024] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (1, 1, 437, N'—', 1)
INSERT [dbo].[DriverStandings2024] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (4, 2, 374, N'-63', 3)
INSERT [dbo].[DriverStandings2024] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (10, 10, 42, N'-395', 4)
INSERT [dbo].[DriverStandings2024] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (11, 8, 152, N'-285', 1)
INSERT [dbo].[DriverStandings2024] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (14, 9, 70, N'-367', 5)
INSERT [dbo].[DriverStandings2024] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (16, 3, 356, N'-81', 6)
INSERT [dbo].[DriverStandings2024] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (18, 13, 24, N'-413', 5)
INSERT [dbo].[DriverStandings2024] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (20, 15, 16, N'-421', 7)
INSERT [dbo].[DriverStandings2024] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (22, 12, 30, N'-407', 1)
INSERT [dbo].[DriverStandings2024] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (23, 16, 12, N'-425', 2)
INSERT [dbo].[DriverStandings2024] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (27, 11, 41, N'-396', 7)
INSERT [dbo].[DriverStandings2024] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (31, 14, 23, N'-414', 4)
INSERT [dbo].[DriverStandings2024] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (44, 7, 223, N'-214', 10)
INSERT [dbo].[DriverStandings2024] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (55, 5, 290, N'-147', 6)
INSERT [dbo].[DriverStandings2024] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (63, 6, 245, N'-192', 10)
INSERT [dbo].[DriverStandings2024] ([DriverId], [Position], [Points], [GapToLeader], [TeamId]) VALUES (81, 4, 292, N'-145', 3)
GO
SET IDENTITY_INSERT [dbo].[Events] ON 

INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (1, N'Bahrain Grand Prix', CAST(N'2024-02-29T00:00:00.000' AS DateTime), N'Sakhir, Bahrain', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (2, N'Saudi Arabian Grand Prix', CAST(N'2024-03-07T00:00:00.000' AS DateTime), N'Jeddah, Saudi Arabia', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (3, N'Australian Grand Prix', CAST(N'2024-03-22T00:00:00.000' AS DateTime), N'Melbourne, Australia', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (4, N'Japanese Grand Prix', CAST(N'2024-04-05T00:00:00.000' AS DateTime), N'Suzuka, Japan', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (5, N'Chinese Grand Prix', CAST(N'2024-04-19T00:00:00.000' AS DateTime), N'Shanghai, China', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (6, N'Miami Grand Prix', CAST(N'2024-05-03T00:00:00.000' AS DateTime), N'Miami, USA', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (7, N'Emilia Romagna Grand Prix', CAST(N'2024-05-17T00:00:00.000' AS DateTime), N'Imola, Italy', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (8, N'Monaco Grand Prix', CAST(N'2024-05-24T00:00:00.000' AS DateTime), N'Monte Carlo, Monaco', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (9, N'Canadian Grand Prix', CAST(N'2024-06-07T00:00:00.000' AS DateTime), N'Montreal, Canada', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (10, N'Spanish Grand Prix', CAST(N'2024-06-21T00:00:00.000' AS DateTime), N'Barcelona, Spain', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (11, N'Austrian Grand Prix', CAST(N'2024-06-28T00:00:00.000' AS DateTime), N'Spielberg, Austria', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (12, N'British Grand Prix', CAST(N'2024-07-05T00:00:00.000' AS DateTime), N'Silverstone, UK', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (13, N'Hungarian Grand Prix', CAST(N'2024-07-19T00:00:00.000' AS DateTime), N'Budapest, Hungary', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (14, N'Belgian Grand Prix', CAST(N'2024-07-26T00:00:00.000' AS DateTime), N'Spa-Francorchamps, Belgium', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (15, N'Dutch Grand Prix', CAST(N'2024-08-23T00:00:00.000' AS DateTime), N'Zandvoort, Netherlands', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (16, N'Italian Grand Prix', CAST(N'2024-08-31T00:00:00.000' AS DateTime), N'Monza, Italy', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (17, N'Azerbaijan Grand Prix', CAST(N'2024-09-13T00:00:00.000' AS DateTime), N'Baku, Azerbaijan', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (18, N'Singapore Grand Prix', CAST(N'2024-09-20T00:00:00.000' AS DateTime), N'Marina Bay, Singapore', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (19, N'United States Grand Prix', CAST(N'2024-10-18T00:00:00.000' AS DateTime), N'Austin, USA', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (20, N'Mexico City Grand Prix', CAST(N'2024-10-25T00:00:00.000' AS DateTime), N'Mexico City, Mexico', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (21, N'São Paulo Grand Prix', CAST(N'2024-11-01T00:00:00.000' AS DateTime), N'São Paulo, Brazil', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (22, N'Las Vegas Grand Prix', CAST(N'2024-11-21T00:00:00.000' AS DateTime), N'Las Vegas, USA', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (23, N'Qatar Grand Prix', CAST(N'2024-11-29T00:00:00.000' AS DateTime), N'Lusail, Qatar', N'')
INSERT [dbo].[Events] ([Id], [RaceName], [RaceDate], [Location], [ImageUrl]) VALUES (24, N'Abu Dhabi Grand Prix', CAST(N'2024-12-06T00:00:00.000' AS DateTime), N'Yas Island, Abu Dhabi', N'')
SET IDENTITY_INSERT [dbo].[Events] OFF
GO
INSERT [dbo].[FavoriteDrivers] ([UserId], [DriverId], [AddedAt]) VALUES (20, 1, CAST(N'2025-04-01T14:13:13.927' AS DateTime))
INSERT [dbo].[FavoriteDrivers] ([UserId], [DriverId], [AddedAt]) VALUES (20, 27, CAST(N'2025-04-21T20:11:00.907' AS DateTime))
INSERT [dbo].[FavoriteDrivers] ([UserId], [DriverId], [AddedAt]) VALUES (21, 1, CAST(N'2025-04-21T21:50:40.053' AS DateTime))
INSERT [dbo].[FavoriteDrivers] ([UserId], [DriverId], [AddedAt]) VALUES (22, 1, CAST(N'2025-04-22T16:00:56.600' AS DateTime))
INSERT [dbo].[FavoriteDrivers] ([UserId], [DriverId], [AddedAt]) VALUES (25, 1, CAST(N'2025-04-23T08:17:56.500' AS DateTime))
INSERT [dbo].[FavoriteDrivers] ([UserId], [DriverId], [AddedAt]) VALUES (30, 10, CAST(N'2025-04-23T14:20:54.050' AS DateTime))
GO
INSERT [dbo].[FavoriteRacingSpots] ([UserId], [SpotName]) VALUES (20, N'Circuit de Spa-Francorchamps')
INSERT [dbo].[FavoriteRacingSpots] ([UserId], [SpotName]) VALUES (21, N'Silverstone Circuit')
INSERT [dbo].[FavoriteRacingSpots] ([UserId], [SpotName]) VALUES (22, N'Interlagos')
INSERT [dbo].[FavoriteRacingSpots] ([UserId], [SpotName]) VALUES (30, N'Brands Hatch')
INSERT [dbo].[FavoriteRacingSpots] ([UserId], [SpotName]) VALUES (30, N'Circuit de Spa-Francorchamps')
INSERT [dbo].[FavoriteRacingSpots] ([UserId], [SpotName]) VALUES (30, N'Hockenheimring')
INSERT [dbo].[FavoriteRacingSpots] ([UserId], [SpotName]) VALUES (30, N'Madrid Racing Circuit')
INSERT [dbo].[FavoriteRacingSpots] ([UserId], [SpotName]) VALUES (30, N'Paul Ricard Circuit')
GO
INSERT [dbo].[FavoriteTeams] ([UserId], [TeamId]) VALUES (30, 1)
INSERT [dbo].[FavoriteTeams] ([UserId], [TeamId]) VALUES (20, 7)
INSERT [dbo].[FavoriteTeams] ([UserId], [TeamId]) VALUES (25, 1)
INSERT [dbo].[FavoriteTeams] ([UserId], [TeamId]) VALUES (21, 1)
GO
SET IDENTITY_INSERT [dbo].[Teams] ON 

INSERT [dbo].[Teams] ([Id], [Name], [Color]) VALUES (1, N'Red Bull Racing', N'#3671C6')
INSERT [dbo].[Teams] ([Id], [Name], [Color]) VALUES (2, N'Williams', N'#37BEDD')
INSERT [dbo].[Teams] ([Id], [Name], [Color]) VALUES (3, N'McLaren', N'#FF8700')
INSERT [dbo].[Teams] ([Id], [Name], [Color]) VALUES (4, N'Alpine', N'#FF87BC')
INSERT [dbo].[Teams] ([Id], [Name], [Color]) VALUES (5, N'Aston Martin', N'#358C75')
INSERT [dbo].[Teams] ([Id], [Name], [Color]) VALUES (6, N'Ferrari', N'#F91536')
INSERT [dbo].[Teams] ([Id], [Name], [Color]) VALUES (7, N'Haas F1 Team', N'#B6BABD')
INSERT [dbo].[Teams] ([Id], [Name], [Color]) VALUES (8, N'AlphaTauri', N'#5E8FAA')
INSERT [dbo].[Teams] ([Id], [Name], [Color]) VALUES (9, N'Alfa Romeo', N'#C92D4B')
INSERT [dbo].[Teams] ([Id], [Name], [Color]) VALUES (10, N'Mercedes', N'#6CD3BF')
SET IDENTITY_INSERT [dbo].[Teams] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([Username], [PasswordHash], [Email], [FavoriteAnimal], [ProfilePhoto], [Id]) VALUES (N'Test', N'$2a$11$WETenClnd91jCpDEU.6Auusrb/kBoCiTySFKk52nd3kNFhn1QfbT2', N'Test@test.test', N'Giraffe', NULL, 20)
INSERT [dbo].[Users] ([Username], [PasswordHash], [Email], [FavoriteAnimal], [ProfilePhoto], [Id]) VALUES (N'Test1', N'$2a$11$1MmRmU/92slq1r/s9Qx/i.rxenISpdWqJeOYUKuMeOVgRQkkGBTYG', N'Test@t.com', N'Dog', N'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', 21)
INSERT [dbo].[Users] ([Username], [PasswordHash], [Email], [FavoriteAnimal], [ProfilePhoto], [Id]) VALUES (N's', N'$2a$11$hPXsF1D6UEMqxP52ZiaExeD7UYAFqAdc3R6bcbvpzTxWnvsY9IF0W', N's@s', N'Shark', N'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', 22)
INSERT [dbo].[Users] ([Username], [PasswordHash], [Email], [FavoriteAnimal], [ProfilePhoto], [Id]) VALUES (N'Alon', N'$2a$11$OHPrBjuSmo3e/G8w7bfp7OmgMRhSQfgbFx37fHeRqv2f8LzU1gMlq', N'A@a.com', N'Shark', NULL, 23)
INSERT [dbo].[Users] ([Username], [PasswordHash], [Email], [FavoriteAnimal], [ProfilePhoto], [Id]) VALUES (N'JoniBoy', N'$2a$11$iDWk0gtoWUdi2.ZhvoDh..U1EcPiBZL1BL0W.wJr5k7/EXpjzHO.q', N'agentcolex@gmail.com', N'Penguin', NULL, 25)
INSERT [dbo].[Users] ([Username], [PasswordHash], [Email], [FavoriteAnimal], [ProfilePhoto], [Id]) VALUES (N'208741512', N'$2a$11$neuXXnM6wJ9blgA95Yy.FOyhYx9djajpNhhU0fXL2Qznv1fs6zl9m', N'dangutman.998@gmail.com', N'Fox', NULL, 27)
INSERT [dbo].[Users] ([Username], [PasswordHash], [Email], [FavoriteAnimal], [ProfilePhoto], [Id]) VALUES (N'Dandan', N'$2a$11$x1q..gY5jJkrHYcd8efPAO/x8/t0THZQS7rW4vEmr1BczSDdwHi.m', N'dan@gmail.com', N'Panda', NULL, 28)
INSERT [dbo].[Users] ([Username], [PasswordHash], [Email], [FavoriteAnimal], [ProfilePhoto], [Id]) VALUES (N'Adi Ronen', N'GOOGLE_AUTH', N'ronendidi@gmail.com', N'Not Set', NULL, 29)
INSERT [dbo].[Users] ([Username], [PasswordHash], [Email], [FavoriteAnimal], [ProfilePhoto], [Id]) VALUES (N'Dan Gutman', N'GOOGLE_AUTH', N'dangutman.98@gmail.com', N'Panda', N'data:image/jpeg;base64,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', 30)
INSERT [dbo].[Users] ([Username], [PasswordHash], [Email], [FavoriteAnimal], [ProfilePhoto], [Id]) VALUES (N'Eyal Cohen', N'GOOGLE_AUTH', N'eyalcohen4.ec@gmail.com', N'Not Set', NULL, 31)
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Users__536C85E459849B25]    Script Date: 10/06/2025 16:46:19 ******/
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[FavoriteDrivers] ADD  DEFAULT (getdate()) FOR [AddedAt]
GO
ALTER TABLE [dbo].[DriverStandings2023]  WITH CHECK ADD  CONSTRAINT [FK_DriverStandings2023_Drivers] FOREIGN KEY([DriverId])
REFERENCES [dbo].[Drivers] ([Id])
GO
ALTER TABLE [dbo].[DriverStandings2023] CHECK CONSTRAINT [FK_DriverStandings2023_Drivers]
GO
ALTER TABLE [dbo].[DriverStandings2023]  WITH CHECK ADD  CONSTRAINT [FK_DriverStandings2023_Teams] FOREIGN KEY([TeamId])
REFERENCES [dbo].[Teams] ([Id])
GO
ALTER TABLE [dbo].[DriverStandings2023] CHECK CONSTRAINT [FK_DriverStandings2023_Teams]
GO
ALTER TABLE [dbo].[DriverStandings2024]  WITH CHECK ADD  CONSTRAINT [FK_DriverStandings2024_Drivers] FOREIGN KEY([DriverId])
REFERENCES [dbo].[Drivers] ([Id])
GO
ALTER TABLE [dbo].[DriverStandings2024] CHECK CONSTRAINT [FK_DriverStandings2024_Drivers]
GO
ALTER TABLE [dbo].[DriverStandings2024]  WITH CHECK ADD  CONSTRAINT [FK_DriverStandings2024_Teams] FOREIGN KEY([TeamId])
REFERENCES [dbo].[Teams] ([Id])
GO
ALTER TABLE [dbo].[DriverStandings2024] CHECK CONSTRAINT [FK_DriverStandings2024_Teams]
GO
ALTER TABLE [dbo].[FavoriteTeams]  WITH NOCHECK ADD  CONSTRAINT [FK_FavoriteTeams_Teams] FOREIGN KEY([TeamId])
REFERENCES [dbo].[Teams] ([Id])
GO
ALTER TABLE [dbo].[FavoriteTeams] NOCHECK CONSTRAINT [FK_FavoriteTeams_Teams]
GO
/****** Object:  StoredProcedure [dbo].[GetFavoriteDrivers]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetFavoriteDrivers]
    @UserId int
AS
BEGIN
    SELECT DriverId
    FROM FavoriteDrivers
    WHERE UserId = @UserId;
END;

GO
/****** Object:  StoredProcedure [dbo].[GetFavoriteTeams]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetFavoriteTeams]
    @UserId int
AS
BEGIN
    SELECT TeamId
    FROM FavoriteTeams
    WHERE UserId = @UserId;
END;

GO
/****** Object:  StoredProcedure [dbo].[GetUserFavorites]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetUserFavorites]
    @UserId int
AS
BEGIN
    SET NOCOUNT ON;

    -- Get favorite drivers with details
    SELECT 
        CAST(d.Id as int) as DriverId,
        ISNULL(d.Name, '') as DriverName,
        ISNULL(d.PhotoURL, '') as PhotoURL,
        CAST(ISNULL(d.TeamId, 0) as int) as TeamId,
        ISNULL(d.AcronymName, '') as AcronymName,
        ISNULL(t.Name, '') as TeamName,
        ISNULL(t.Color, '') as TeamColor
    FROM FavoriteDrivers fd
    INNER JOIN Drivers d ON fd.DriverId = d.Id
    LEFT JOIN Teams t ON d.TeamId = t.Id
    WHERE fd.UserId = @UserId;

    -- Get favorite teams with details
    SELECT 
        CAST(t.Id as int) as TeamId,
        ISNULL(t.Name, '') as TeamName,
        ISNULL(t.Color, '') as Color
    FROM FavoriteTeams ft
    INNER JOIN Teams t ON ft.TeamId = t.Id
    WHERE ft.UserId = @UserId;

    -- Get favorite racing spots
    SELECT ISNULL(SpotName, '')
    FROM FavoriteRacingSpots
    WHERE UserId = @UserId;
END;

GO
/****** Object:  StoredProcedure [dbo].[SaveEvent]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Create stored procedure for saving events
CREATE   PROCEDURE [dbo].[SaveEvent]
    @RaceName NVARCHAR(255),
    @RaceDate DATETIME,
    @Location NVARCHAR(255),
    @ImageUrl NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if event already exists based on name and date
    IF EXISTS (SELECT 1 FROM Events WHERE RaceName = @RaceName AND RaceDate = @RaceDate)
    BEGIN
        -- Update existing event
        UPDATE Events
        SET Location = @Location,
            ImageUrl = @ImageUrl
        WHERE RaceName = @RaceName AND RaceDate = @RaceDate
    END
    ELSE
    BEGIN
        -- Insert new event
        INSERT INTO Events (RaceName, RaceDate, Location, ImageUrl)
        VALUES (@RaceName, @RaceDate, @Location, @ImageUrl)
    END
END
GO
/****** Object:  StoredProcedure [dbo].[SetFavoriteDriver]    Script Date: 10/06/2025 16:46:19 ******/
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
/****** Object:  StoredProcedure [dbo].[SetFavoriteRacingSpot]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SetFavoriteRacingSpot]
    @UserId int,
    @SpotName nvarchar(255)
AS
BEGIN
    -- Check if this spot is already a favorite
    IF EXISTS (SELECT 1 FROM FavoriteRacingSpots WHERE UserId = @UserId AND SpotName = @SpotName)
    BEGIN
        -- If it is, remove it
        DELETE FROM FavoriteRacingSpots
        WHERE UserId = @UserId AND SpotName = @SpotName;
    END
    ELSE
    BEGIN
        -- Add the new favorite spot
        INSERT INTO FavoriteRacingSpots (UserId, SpotName)
        VALUES (@UserId, @SpotName);
    END
END;

GO
/****** Object:  StoredProcedure [dbo].[SetFavoriteTeam]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SetFavoriteTeam]
    @UserId int,
    @TeamId int
AS
BEGIN
    -- Check if this team is already a favorite
    IF EXISTS (SELECT 1 FROM FavoriteTeams WHERE UserId = @UserId AND TeamId = @TeamId)
    BEGIN
        -- If it is, remove it
        DELETE FROM FavoriteTeams
        WHERE UserId = @UserId AND TeamId = @TeamId;
    END
    ELSE
    BEGIN
        -- Remove any existing favorite team and add the new one
        DELETE FROM FavoriteTeams
        WHERE UserId = @UserId;
        
        -- Add the new favorite team
        INSERT INTO FavoriteTeams (UserId, TeamId)
        VALUES (@UserId, @TeamId);
    END;
END;

GO
/****** Object:  StoredProcedure [dbo].[SP_AddDriver]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_AddDriver]
    @Id INT,
    @Name NVARCHAR(255),
    @PhotoURL NVARCHAR(500) = NULL,
    @TeamId INT = NULL,
    @AcronymName NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Enable IDENTITY_INSERT for inserting custom IDs
        SET IDENTITY_INSERT Drivers ON;

        -- Insert driver with an explicit ID
        INSERT INTO Drivers (Id, Name, PhotoURL, TeamId, AcronymName)
        VALUES (@Id, @Name, @PhotoURL, @TeamId, @AcronymName);

        -- Disable IDENTITY_INSERT after insertion
        SET IDENTITY_INSERT Drivers OFF;
    END TRY
    BEGIN CATCH
        -- Disable IDENTITY_INSERT if an error occurs
        SET IDENTITY_INSERT Drivers OFF;
        SELECT ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddNewUser]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_AddNewUser]
    @Username NVARCHAR(100),
    @PasswordHash NVARCHAR(MAX),
    @Email NVARCHAR(100),
    @FavoriteAnimal NVARCHAR(50) = NULL,
    @ProfilePhoto NVARCHAR(MAX) = NULL,
    @NewUserID INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- Insert the new user
    INSERT INTO Users (
        Username,
        PasswordHash,
        Email,
        FavoriteAnimal,
        ProfilePhoto
    )
    VALUES (
        @Username,
        @PasswordHash,
        @Email,
        ISNULL(@FavoriteAnimal, 'Not Set'),
        @ProfilePhoto
    );

    -- Get the newly inserted user's actual ID
    SET @NewUserID = SCOPE_IDENTITY();

    -- Return the user
    SELECT 
        Id,
        Username,
        PasswordHash,
        Email,
        FavoriteAnimal,
        ProfilePhoto
    FROM Users
    WHERE Id = @NewUserID;
END

GO
/****** Object:  StoredProcedure [dbo].[SP_ClearDriverStandings]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_ClearDriverStandings]
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM [dbo].[DriverStandings2023];
    DELETE FROM [dbo].[DriverStandings2024];
END

GO
/****** Object:  StoredProcedure [dbo].[SP_DeleteDriverStanding]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_DeleteDriverStanding]
    @DriverId INT,
    @TeamId INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM [dbo].[DriverStandings]
    WHERE DriverId = @DriverId AND TeamId = @TeamId;
END;
GO
/****** Object:  StoredProcedure [dbo].[SP_DeleteUser]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_DeleteUser]
    @UserID INT
AS
BEGIN
    -- Delete from FavoriteTeams first
    DELETE FROM FavoriteTeams WHERE UserId = @UserID;
    DELETE FROM FavoriteDrivers WHERE UserId = @UserID;
    DELETE FROM FavoriteRacingSpots WHERE UserId = @UserID;
    
    -- Then delete the user
    DELETE FROM Users WHERE Id = @UserID;

    -- Get the max ID
    DECLARE @MaxID int;
    SELECT @MaxID = ISNULL(MAX(Id), 0) FROM Users;

    -- Reseed to the current max value
    DBCC CHECKIDENT ('Users', RESEED, @MaxID);
END

GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllDrivers]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[SP_GetAllDrivers]
AS
BEGIN
    SELECT 
        d.Id,
        d.Name,
        d.PhotoURL,
        d.TeamId,
        d.AcronymName,
        t.Name as TeamName,
        t.Color as TeamColor
    FROM Drivers d
    LEFT JOIN Teams t ON d.TeamId = t.Id;
END;
GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllTeams]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[SP_GetAllTeams]
AS
BEGIN
    SELECT 
        Id,
        Name,
        Color
    FROM Teams;
END;
GO
/****** Object:  StoredProcedure [dbo].[SP_GetDriverStandings]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_GetDriverStandings]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT DriverId, Position, Points, GapToLeader, TeamId
    FROM [dbo].[DriverStandings]
    ORDER BY Position;
END;
GO
/****** Object:  StoredProcedure [dbo].[SP_GetUserById]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_GetUserById]
    @UserId int
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.Id, 
        u.Username, 
        u.PasswordHash, 
        u.Email, 
        u.FavoriteAnimal,
        CASE 
            WHEN p.ProfilePhoto IS NOT NULL 
            THEN 'data:image/jpeg;base64,' + p.ProfilePhoto 
            ELSE NULL 
        END as ProfilePhoto
    FROM Users u
    LEFT JOIN Profile p ON u.Id = p.UserId
    WHERE u.Id = @UserId
END

GO
/****** Object:  StoredProcedure [dbo].[SP_GetUserByUsername]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_GetUserByUsername]
    @Username nvarchar(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.Id, 
        u.Username, 
        u.PasswordHash, 
        u.Email, 
        u.FavoriteAnimal,
        CASE 
            WHEN p.ProfilePhoto IS NOT NULL 
            THEN 'data:image/jpeg;base64,' + p.ProfilePhoto 
            ELSE NULL 
        END as ProfilePhoto
    FROM Users u
    LEFT JOIN Profile p ON u.Id = p.UserId
    WHERE u.Username = @Username
END

GO
/****** Object:  StoredProcedure [dbo].[SP_GetUserProfile]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Create SP_GetUserProfile stored procedure
CREATE PROCEDURE [dbo].[SP_GetUserProfile]
    @UserId int
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            Id,
            Username,
            Email,
            FavoriteAnimal,
            ProfilePhoto
        FROM Users
        WHERE Id = @UserId;
    END TRY
    BEGIN CATCH
        -- Log the error
        DECLARE @ErrorMessage nvarchar(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity int = ERROR_SEVERITY();
        DECLARE @ErrorState int = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH;
END;

GO
/****** Object:  StoredProcedure [dbo].[SP_InsertDriverStandings2023]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_InsertDriverStandings2023]
    @DriverId INT,
    @Position INT,
    @Points INT,
    @GapToLeader NVARCHAR(50),
    @TeamId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO [dbo].[DriverStandings2023] (DriverId, Position, Points, GapToLeader, TeamId)
    VALUES (@DriverId, @Position, @Points, @GapToLeader, @TeamId);
END

GO
/****** Object:  StoredProcedure [dbo].[SP_InsertDriverStandings2024]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_InsertDriverStandings2024]
    @DriverId INT,
    @Position INT,
    @Points INT,
    @GapToLeader NVARCHAR(50),
    @TeamId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO [dbo].[DriverStandings2024] (DriverId, Position, Points, GapToLeader, TeamId)
    VALUES (@DriverId, @Position, @Points, @GapToLeader, @TeamId);
END

GO
/****** Object:  StoredProcedure [dbo].[SP_SaveTeams]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_SaveTeams]
    @TeamId INT,
    @TeamName NVARCHAR(255),
    @TeamColor NVARCHAR(7)
AS
BEGIN
    -- Enable explicit ID insert
    SET IDENTITY_INSERT Teams ON;

    -- Check if the team already exists
    IF EXISTS (SELECT 1 FROM Teams WHERE Id = @TeamId)
    BEGIN
        -- Update existing team
        UPDATE Teams
        SET Name = @TeamName,
            Color = @TeamColor
        WHERE Id = @TeamId;
    END
    ELSE
    BEGIN
        -- Insert a new team
        INSERT INTO Teams (Id, Name, Color)
        VALUES (@TeamId, @TeamName, @TeamColor);
    END

    -- Disable explicit ID insert
    SET IDENTITY_INSERT Teams OFF;
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateProfilePhoto]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_UpdateProfilePhoto]
    @UserId INT,
    @ProfilePhoto NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Users
    SET ProfilePhoto = @ProfilePhoto
    WHERE Id = @UserId;

    SELECT ProfilePhoto
    FROM Users
    WHERE Id = @UserId;
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateTeam]    Script Date: 10/06/2025 16:46:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_UpdateTeam]
    @TeamId INT,
    @TeamName NVARCHAR(255),
    @TeamColor NVARCHAR(7)
AS
BEGIN
    UPDATE Teams
    SET Name = @TeamName,
        Color = @TeamColor
    WHERE Id = @TeamId;
END
GO
USE [master]
GO
ALTER DATABASE [igroup179_prod] SET  READ_WRITE 
GO
