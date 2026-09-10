import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  AlertCircle,
  Calendar
} from 'lucide-react';
import AssignTaskModal from '../components/AssignTaskModal';

const AdminTasks = () => {
  const { showToast } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [page, search]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/tasks?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
      setTasks(response.data.tasks || []);
      setPagination(response.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (error) {
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search query change
  };

  return (
    <div>
      <div className="table-card">
        {/* Toolbar with Search and Assign Button */}
        <div className="table-header-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by title or employee name..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>Assign Task</span>
          </button>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="loading-spinner-wrapper">
            <div className="spinner"></div>
            <p>Loading task records...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <AlertCircle className="empty-state-icon" />
            <div className="empty-state-title">No tasks found</div>
            <p>
              {search
                ? `No tasks match your search "${search}".`
                : 'No tasks assigned yet. Click "+ Assign Task" to create one.'}
            </p>
          </div>
        ) : (
          <div className="custom-table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Description</th>
                  <th>Assigned Employee</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Updated Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id}>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{task.title}</strong>
                    </td>
                    <td style={{ maxWidth: '250px', color: '#475569', fontSize: '0.875rem' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {task.description}
                      </div>
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
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.8125rem' }}>
                        <Calendar size={13} />
                        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.8125rem' }}>
                        <Calendar size={13} />
                        <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Server-Side Pagination Controls */}
        {!loading && tasks.length > 0 && (
          <div className="pagination-bar">
            <div className="pagination-info">
              Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total tasks)
            </div>

            <div className="pagination-controls">
              <button
                className="btn-secondary"
                disabled={pagination.page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  className={`page-number-btn ${pageNum === pagination.page ? 'active' : ''}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              <button
                className="btn-secondary"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Assign Task Modal */}
      <AssignTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTasks}
      />
    </div>
  );
};

export default AdminTasks;
