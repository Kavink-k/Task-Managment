import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Clock, Hourglass, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { user, showToast } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tasks/my');
      setTasks(response.data.tasks || []);
    } catch (error) {
      showToast('Unable to fetch assigned tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const notStartedCount = tasks.filter((t) => t.status === 'Not Started').length;
  const pendingOrInProgressCount = tasks.filter(
    (t) => t.status === 'Pending' || t.status === 'In Progress'
  ).length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          padding: '28px 32px',
          borderRadius: '12px',
          marginBottom: '28px',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '6px' }}>
          Welcome back, {user?.name || 'Employee'}! 👋
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9375rem' }}>
          Here is an overview of your current workspace assignment and task statuses.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Not Started</div>
            <div className="stat-value">{loading ? '...' : notStartedCount}</div>
          </div>
          <div className="stat-icon-wrapper not-started">
            <Clock size={28} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Pending / In Progress</div>
            <div className="stat-value">{loading ? '...' : pendingOrInProgressCount}</div>
          </div>
          <div className="stat-icon-wrapper pending">
            <Hourglass size={28} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Completed</div>
            <div className="stat-value">{loading ? '...' : completedCount}</div>
          </div>
          <div className="stat-icon-wrapper completed">
            <CheckCircle2 size={28} />
          </div>
        </div>
      </div>

      {/* Task Summary Table */}
      <div className="table-card">
        <div className="table-header-toolbar">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            My Assigned Tasks
          </h3>
          <Link to="/employee/tasks" className="btn-secondary" style={{ fontSize: '0.8125rem' }}>
            <span>Manage All My Tasks</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="loading-spinner-wrapper">
            <div className="spinner"></div>
            <p>Loading your assigned tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <AlertCircle className="empty-state-icon" />
            <div className="empty-state-title">No tasks assigned</div>
            <p>You currently have no active assigned tasks from the administrator.</p>
          </div>
        ) : (
          <div className="custom-table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Current Status</th>
                  <th>Assigned Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 5).map((task) => (
                  <tr key={task._id}>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{task.title}</strong>
                    </td>
                    <td style={{ maxWidth: '300px', color: '#475569' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {task.description}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-priority-${task.priority?.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-status-${task.status
                          ?.toLowerCase()
                          .replace(/\s+/g, '-')}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
