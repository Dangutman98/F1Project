🏎️ ## Project F1

🚀 # Project Overview
An interactive Formula 1 full-stack web app where users can explore races, weather conditions, and teams — and personalize their own profile.

🔧 # Tech Stack
- **Frontend:** React (TypeScript), Firebase (Auth + Firestore)
- **Backend:** ASP.NET Core (.NET 6)
- **Other Tools:** OpenF1 API, OpenWeatherMap API, Git LFS

🧩 # Key Features
- 🔐 Authentication using Firebase
- ☁️ Real-time weather updates for race locations
- 🏁 Dynamic content for F1 teams, events, and tracks
- 👤 Editable user profile (photo upload, favorite drivers/teams/circuits/animals)
- 🌐 Responsive design for desktop and mobile
- 🖼️ Media-rich UI with logos, race images, and carousel animations
  
🔗 # API Links
- OpenF1 API
- OpenWeatherMap API

⚡ # Prerequisites
- Node.js (v16+)
- .NET 6 SDK
- SQL Server (2019+)
- Firebase project (for Auth/Firestore)
- OpenWeatherMap API key
- Git LFS

🚀 # Quick Start
1. Clone the repository and set up Git LFS
    git clone https://github.com/Dangutman98/F1Project.git
    cd F1Project
    git lfs install
    git lfs pull

2. Set up the database
- Install SQL Server if it is not already installed.
- Run the initialization script:
    cd server/SQL
    sqlcmd -S your_server -d master -i init.sql
- Update your connection string in server/appsettings.json.

3. Configure environment variables
**Client**
- Copy client/.env.example to client/.env
- Fill in Firebase and OpenWeatherMap API keys
**Server**
- Copy server/appsettings.example.json to server/appsettings.json
- Fill in the database, JWT, and Firebase Admin SDK credentials
  
4. Install dependencies and run
**Client**
cd client
npm install
npm run dev

**Server**
cd server
dotnet restore
dotnet run

🗂️ # Project Structure
<pre>
F1Project/
├── client/      # React frontend application
├── server/      # .NET Core backend API and SQL scripts
├── secrets/     # Configuration templates (not for production)
└── node_modules/ # Frontend dependencies
</pre>

🖼️ # Assets
- Managed with Git LFS
- Located in client/src/assets/
- TeamsIcons/ - Team logos and icons
- events-pics/ - Event images
- racing-spots/ - Racing spot and car carousel images

📝 # Notes
- Ensure Git LFS is installed before cloning to get all assets.
- Never commit real secrets or credentials to the repository.
- For any issues, check your environment variables and database setup first.

**Reference:**
Dangutman98/F1Project on GitHub
