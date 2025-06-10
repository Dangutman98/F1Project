🏎️ ***Project F1***

<<<<<<< HEAD
## Overview
This is a comprehensive Formula 1 web application that provides fans with real-time race information, team statistics, and an interactive experience for following the F1 season. The project is built using modern web technologies and follows a client-server architecture.

### Key Features
- Real-time race updates and statistics
- Team and driver information
- Weather updates for race locations
- Interactive race calendar
- User authentication and personalized experience
- Responsive design for all devices

## Technology Stack
### Frontend
- React.js with TypeScript
- Firebase Authentication
- HeadlessUI for UI components
- OpenWeatherMap API integration
- Responsive design with modern CSS

### Backend
- .NET Core API
- SQL Database
- Firebase Admin SDK
- JWT Authentication
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- .NET Core SDK
- Git and Git LFS
- SQL Server
- Firebase account
- OpenWeatherMap API key

## Environment Setup
=======
# 🚀 Project Overview
>>>>>>> c5d650a43c16647ee2e661ad4b540fce15b61a4f

An interactive Formula 1 full-stack web app where users can explore races, weather conditions, and teams — and personalize their own profile.

---
## 🔧 Tech Stack
- **Frontend**: React (TypeScript), Firebase (Auth + Firestore)
- **Backend**: ASP.NET Core (.NET 6)
- **Other Tools**: OpenF1 API,OpenWeatherMap API, Git LFS
---
### 🧩 Key Features
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

**#### API links**
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
1. Copy `server/appsettings.example.json` to `server/appsettings.json`
2. Fill in the configuration in `server/appsettings.json`:
   - Database connection string
   - JWT settings for authentication
   - Firebase Admin SDK credentials

## Security Notes
- Never commit `.env` or `appsettings.json` files to version control
- Keep your API keys and secrets secure
- Use different credentials for development and production environments

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
Note: Make sure you have Git LFS installed before cloning the repository to ensure all assets are downloaded correctly.

## Project Structure
```
F1Project/
├── client/           # React frontend application
├── server/           # .NET Core backend API
├── secrets/          # Configuration templates
└── node_modules/     # Frontend dependencies
```

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Formula 1 for inspiration and data
- OpenWeatherMap for weather data
- Firebase for authentication services
- All contributors who have helped with the project 
=======
Note: Make sure you have Git LFS installed before cloning the repository to ensure all assets are downloaded correctly. 
>>>>>>> c5d650a43c16647ee2e661ad4b540fce15b61a4f
