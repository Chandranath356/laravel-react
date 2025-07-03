import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/login';
import Dashboard from './pages/dashboard';
import UserCreate from './pages/user/create';
import User from './pages/user/index';
import { useState, useEffect } from "react";
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

function Index() {

  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<PublicRoute><Login /></PublicRoute>} />
          <Route element={<PrivateRoute />}>
            <Route  path="/users" element={ <Dashboard />}>
              <Route index element={<UserCreate />} />
            </Route>
          </Route>
        </Routes>
    </div>
  );
}

export default Index;