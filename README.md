🏎️ ***Project F1***
## 🚀 Project Overview

An interactive Formula 1 full-stack web app where users can explore races, weather conditions, and teams — and personalize their own profile.

---
## 🔧 Tech Stack
- **Frontend**: React (TypeScript), Firebase (Auth + Firestore)
- **Backend**: ASP.NET Core (.NET 6)
- **Other Tools**: OpenF1 API,OpenWeatherMap API, Git LFS
---
## 🧩 Key Features
- 🔐 **Authentication** using Firebase
- ☁️ **Real-time weather updates** for race locations
- 🏁 **Dynamic content** for F1 teams, events, and tracks
- 👤 **Editable user profile**:
  - Upload profile photo (with image upload plugin)
  - Select favorite:
    - Drivers
    - Teams
    - Circuits
    - Animals 🐾 (just for fun!)
- 🌐 **Responsive design** for desktop and mobile
- 🖼️ **Media-rich UI** with logos, race images, and carousel animations

**## API links**
- https://openf1.org/
- https://openweathermap.org/api


------------------------------need to be changed---------------------------------
### Client Setup
1. Copy `client/.env.example` to `client/.env`
2. Fill in the environment variables in `client/.env`:
   - Firebase configuration from your Firebase project settings
   - Weather API key from OpenWeatherMap
   - API base URL (default: http://localhost:5000)

### Server Setup
   # Database Setup
   1. Install SQL Server (if not already installed)
   2. Run the initialization script:
      ```bash
      cd server/SQL
      sqlcmd -S your_server -d master -i init.sql
      ```
   3. Update your connection string in `server/appsettings.json` to point to the new database.

#
1. Copy `server/appsettings.example.json` to `server/appsettings.json`
2. Fill in the configuration in `server/appsettings.json`:
   - Database connection string
   - JWT settings for authentication
   - Firebase Admin SDK credentials

## Assets Setup

This project uses Git LFS (Large File Storage) to manage assets like images. To properly clone and work with this repository, follow these steps:

1. Install Git LFS:
   - Windows: Download and install from https://git-lfs.com
   - Mac: `brew install git-lfs`
   - Linux: `sudo apt-get install git-lfs`

2. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd [repository-name]
   ```

3. Set up Git LFS:
   ```bash
   git lfs install
   ```

4. Pull the assets:
   ```bash
   git lfs pull
   ```

The assets are located in the following directories:
- `client/src/assets/TeamsIcons/` - Team logos and icons
- `client/src/assets/events-pics/` - Event images
- `client/src/assets/racing-spots/` - Racing spot images
- `client/src/assets/racing-spots/` - Car carousel images
<<<<<<< HEAD
Note: Ensure Git LFS is installed before cloning the repository to ensure all assets are downloaded correctly.

## Project Structure
```
F1Project/
├── client/           # React frontend application
├── server/           # .NET Core backend API
├── secrets/          # Configuration templates
└── node_modules/     # Frontend dependencies
```

