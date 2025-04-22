import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import ProtectedRoute from './components/ProtectedRoute';
import TeamsAndDrivers from './components/TeamsAndDrivers';
import Events from './components/Events';
import RacingSpots from './components/RacingSpots';
import DriverStandings from './components/DriverStandings';
import RaceWeather from './components/RaceWeather';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="flex-1">
                      <Navigate to="/home" replace />
                    </main>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="flex-1">
                      <HomePage />
                    </main>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="flex-1">
                      <Profile />
                    </main>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="flex-1">
                      <EditProfile />
                    </main>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teams-and-drivers"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="flex-1">
                      <TeamsAndDrivers />
                    </main>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="flex-1">
                      <Events />
                    </main>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/racing-spots"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="flex-1">
                      <RacingSpots />
                    </main>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/race-weather"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="flex-1">
                      <RaceWeather />
                    </main>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/standings"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="flex-1">
                      <DriverStandings />
                    </main>
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
