import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Clock,
  Hourglass,
  CheckCircle2,
  Plus,
  ArrowRight,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import AssignTaskModal from '../components/AssignTaskModal';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { showToast } = useAuth();
  const [stats, setStats] = useState({
    notStarted: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats and recent tasks concurrently
      const [statsRes, tasksRes] = await Promise.all([
        api.get('/tasks/stats'),
        api.get('/tasks?page=1&limit=5')
      ]);

      setStats(statsRes.data.stats || { notStarted: 0, pending: 0, inProgress: 0, completed: 0 });
      setRecentTasks(tasksRes.data.tasks || []);
    } catch (error) {
      showToast('Unable to load dashboard data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const pendingOrInProgress = (stats.pending || 0) + (stats.inProgress || 0);

  return (
    <div>
      {/* Top Banner with Quick Actions */}
      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
            System Overview & Metrics
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Real-time task distribution and employee workflow statistics
          </p>
        </div>

        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>Assign Task</span>
        </button>
      </div>

      {/* Primary Statistic Cards */}
      <div className="stats-grid">
        {/* Not Started */}
        <div className="stat-card">
          <div>
            <div className="stat-label">Not Started</div>
            <div className="stat-value">{loading ? '...' : stats.notStarted}</div>
          </div>
          <div className="stat-icon-wrapper not-started">
            <Clock size={28} />
          </div>
        </div>

        {/* Pending / In Progress */}
        <div className="stat-card">
          <div>
            <div className="stat-label">Pending / In Progress</div>
            <div className="stat-value">{loading ? '...' : pendingOrInProgress}</div>
          </div>
          <div className="stat-icon-wrapper pending">
            <Hourglass size={28} />
          </div>
        </div>

        {/* Completed */}
        <div className="stat-card">
          <div>
            <div className="stat-label">Completed</div>
            <div className="stat-value">{loading ? '...' : stats.completed}</div>
          </div>
          <div className="stat-icon-wrapper completed">
            <CheckCircle2 size={28} />
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="table-card">
        <div className="table-header-toolbar">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            Recent Assigned Tasks
          </h3>
          <Link to="/admin/tasks" className="btn-secondary" style={{ fontSize: '0.8125rem' }}>
            <span>View All Tasks</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="loading-spinner-wrapper">
            <div className="spinner"></div>
            <p>Loading statistics and task data...</p>
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="empty-state">
            <AlertCircle className="empty-state-icon" />
            <div className="empty-state-title">No tasks found</div>
            <p>Get started by clicking "+ Assign Task" above.</p>
          </div>
        ) : (
          <div className="custom-table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Assigned Employee</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task) => (
                  <tr key={task._id}>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{task.title}</strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserCheck size={16} color="#64748b" />
                        <span>{task.assignedTo?.name || 'Unassigned'}</span>
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

      {/* Modal Form */}
      <AssignTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
};

export default AdminDashboard;
