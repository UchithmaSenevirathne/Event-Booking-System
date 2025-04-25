import React from 'react';
import logo from './logo.svg';
import './App.css';
import WebLayout from './pages/website/WebLayout';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import SignUp from './pages/register';

function App() {
  return (
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
        {/* <Route path="/layout/*" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="home" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="items" element={<Items />} />
        </Route> */}
      </Routes>
  );
}

export default App;
