import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';

const EmployeeTasks = () => {
  const { showToast } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tasks/my');
      setTasks(response.data.tasks || []);
    } catch (error) {
      showToast('Failed to fetch assigned tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);
    try {
      const response = await api.patch(`/tasks/${taskId}/status`, {
        status: newStatus
      });

      showToast('Task status updated successfully', 'success');
      
      // Update local state immediately
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === taskId ? response.data.task : t))
      );
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update task status';
      showToast(msg, 'error');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const statusOptions = ['Not Started', 'Pending', 'In Progress', 'Completed'];

  return (
    <div>
      <div className="table-card">
        <div className="table-header-toolbar">
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>
              My Assigned Tasks
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              Update your task progress status below to notify system administrators.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner-wrapper">
            <div className="spinner"></div>
            <p>Loading your assigned tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <AlertCircle className="empty-state-icon" />
            <div className="empty-state-title">No tasks assigned yet</div>
            <p>Your administrator has not assigned any tasks to your account.</p>
          </div>
        ) : (
          <div className="custom-table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Update Status</th>
                  <th>Assigned Date</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id}>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{task.title}</strong>
                    </td>
                    <td style={{ maxWidth: '320px', color: '#475569', fontSize: '0.875rem' }}>
                      {task.description}
                    </td>
                    <td>
                      <span className={`badge badge-priority-${task.priority?.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={task.status}
                        disabled={updatingTaskId === task._id}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        style={{
                          backgroundColor:
                            task.status === 'Completed'
                              ? '#f0fdf4'
                              : task.status === 'In Progress'
                              ? '#eff6ff'
                              : task.status === 'Pending'
                              ? '#fff7ed'
                              : '#f1f5f9',
                          color:
                            task.status === 'Completed'
                              ? '#15803d'
                              : task.status === 'In Progress'
                              ? '#1d4ed8'
                              : task.status === 'Pending'
                              ? '#c2410c'
                              : '#475569'
                        }}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.8125rem' }}>
                        <Calendar size={13} />
                        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.8125rem' }}>
                        <Clock size={13} />
                        <span>{new Date(task.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
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

export default EmployeeTasks;
