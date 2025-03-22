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
import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/teams-and-drivers" element={<ProtectedRoute><TeamsAndDrivers /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/racing-spots" element={<ProtectedRoute><RacingSpots /></ProtectedRoute>} />
          <Route path="/standings" element={<ProtectedRoute><DriverStandings /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
