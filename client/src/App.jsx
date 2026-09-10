import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminEmployees from './pages/AdminEmployees';
import AdminTasks from './pages/AdminTasks';

import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeTasks from './pages/EmployeeTasks';

import Forbidden from './pages/Forbidden';
import NotFound from './pages/NotFound';

function App() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Root Redirection */}
      <Route
        path="/"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : user?.role === 'admin' ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/employee/dashboard" replace />
          )
        }
      />

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/employees" element={<AdminEmployees />} />
          <Route path="/admin/tasks" element={<AdminTasks />} />
        </Route>
      </Route>

      {/* Employee Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/tasks" element={<EmployeeTasks />} />
        </Route>
      </Route>

      {/* Auxiliary Error Pages */}
      <Route path="/403" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
