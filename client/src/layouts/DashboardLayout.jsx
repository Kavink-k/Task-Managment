import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  LogOut,
  Menu,
  X,
  UserCheck
} from 'lucide-react';
import Toast from '../components/Toast';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

  // Get dynamic page title based on current pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'Admin Dashboard';
    if (path.includes('/admin/employees')) return 'Employee Directory';
    if (path.includes('/admin/tasks')) return 'Task Management';
    if (path.includes('/employee/dashboard')) return 'Employee Overview';
    if (path.includes('/employee/tasks')) return 'My Assigned Tasks';
    return 'Dashboard';
  };

  const navItems = isAdmin
    ? [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/employees', label: 'Employees', icon: Users },
        { path: '/admin/tasks', label: 'Tasks', icon: CheckSquare }
      ]
    : [
        { path: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/employee/tasks', label: 'My Tasks', icon: CheckSquare }
      ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="app-layout">
      {/* Toast notifications */}
      <Toast />

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo">TF</div>
          <div>
            <div className="brand-title">TaskFlow</div>
            <div className="brand-subtitle">Management System</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="main-wrapper">
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="page-title">{getPageTitle()}</h1>
          </div>

          <div className="user-profile-badge">
            <div className="avatar-circle">{getInitials(user?.name)}</div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-role-badge">
                {isAdmin ? 'Admin' : 'Employee'}
              </span>
            </div>
          </div>
        </header>

        <main className="content-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
