import React from 'react';
import logo from './logo.svg';
import './App.css';
import WebLayout from './pages/website/WebLayout';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import SignUp from './pages/register';
import Dashboard from './pages/dashboard/Dashboard';
import AppLayout from './pages/dashboard/AppLayout';
import { UserProvider } from './components/UserContext';
import Booking from './pages/bookings/booking';

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WebLayout/>}/>
        <Route
          path="/login"
          element={<Login/>}
        />
        <Route
          path="/signup"
          element={<SignUp/>}
        />

        {/* Protected Routes - Layout wraps around these routes */}
        <Route path="/layout/*" element={<AppLayout/>}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<Dashboard />} />
          <Route path="bookings" element={<Booking />} />
        </Route>
      </Routes>
      </UserProvider>
  );
}

export default App;
