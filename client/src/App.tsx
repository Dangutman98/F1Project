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
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Navbar />
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-profile" 
            element={
              <ProtectedRoute>
                <Navbar />
                <EditProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Navbar />
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teams-and-drivers" 
            element={
              <ProtectedRoute>
                <Navbar />
                <TeamsAndDrivers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events" 
            element={
              <ProtectedRoute>
                <Navbar />
                <Events />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/racing-spots" 
            element={
              <ProtectedRoute>
                <Navbar />
                <RacingSpots />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/standings" 
            element={
              <ProtectedRoute>
                <Navbar />
                <DriverStandings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/race-weather" 
            element={
              <ProtectedRoute>
                <Navbar />
                <RaceWeather />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
