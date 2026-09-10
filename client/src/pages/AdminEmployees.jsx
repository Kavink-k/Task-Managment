import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Search,
  X
} from 'lucide-react';
import EmployeeModal from '../components/EmployeeModal';

const AdminEmployees = () => {
  const { showToast } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  // Delete Confirmation State
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get('/employees');
      setEmployees(response.data.employees || []);
    } catch (error) {
      showToast('Failed to load employee list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEmployeeToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (employee) => {
    setEmployeeToEdit(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/employees/${employeeToDelete._id}`);
      showToast(`Employee '${employeeToDelete.name}' deleted successfully`, 'success');
      setEmployeeToDelete(null);
      fetchEmployees();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete employee';
      showToast(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="table-card">
        <div className="table-header-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search employee by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleOpenAddModal}>
            <Plus size={18} />
            <span>Add Employee</span>
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner-wrapper">
            <div className="spinner"></div>
            <p>Loading employee records...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <AlertCircle className="empty-state-icon" />
            <div className="empty-state-title">No employees found</div>
            <p>
              {search
                ? `No employees match your search "${search}".`
                : 'Click "+ Add Employee" to create the first employee account.'}
            </p>
          </div>
        ) : (
          <div className="custom-table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Email Address</th>
                  <th>Total Tasks</th>
                  <th>Pending Tasks</th>
                  <th>Completed Tasks</th>
                  <th>Registered Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            border: '1px solid #bfdbfe'
                          }}
                        >
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <strong style={{ color: '#0f172a' }}>{emp.name}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                        <Mail size={14} color="#94a3b8" />
                        <span>{emp.email}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{emp.totalTasks}</span>
                    </td>
                    <td>
                      <span
                        className="badge badge-status-pending"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Clock size={12} />
                        <span>{emp.pendingTasks}</span>
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge badge-status-completed"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <CheckCircle2 size={12} />
                        <span>{emp.completedTasks}</span>
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                        <Calendar size={14} />
                        <span>{new Date(emp.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '8px'
                        }}
                      >
                        <button
                          className="btn-secondary"
                          onClick={() => handleOpenEditModal(emp)}
                          style={{ padding: '6px 10px', fontSize: '0.8125rem' }}
                          title="Edit Employee"
                        >
                          <Edit2 size={14} color="#2563eb" />
                          <span>Edit</span>
                        </button>

                        <button
                          className="btn-secondary"
                          onClick={() => setEmployeeToDelete(emp)}
                          style={{
                            padding: '6px 10px',
                            fontSize: '0.8125rem',
                            borderColor: '#fecaca',
                            color: '#dc2626'
                          }}
                          title="Delete Employee"
                        >
                          <Trash2 size={14} color="#dc2626" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEmployees}
        employeeToEdit={employeeToEdit}
      />

      {/* Delete Confirmation Modal */}
      {employeeToDelete && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: '#dc2626' }}>
                Confirm Employee Deletion
              </h3>
              <button className="close-btn" onClick={() => setEmployeeToDelete(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ color: '#334155', fontSize: '0.9375rem', lineHeight: '1.5' }}>
                Are you sure you want to delete employee <strong>{employeeToDelete.name}</strong> (
                {employeeToDelete.email})?
              </p>

              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  color: '#991b1b'
                }}
              >
                ⚠️ <strong>Warning:</strong> Deleting this employee will also delete all tasks assigned to them ({employeeToDelete.totalTasks} tasks).
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setEmployeeToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleDeleteEmployee}
                disabled={deleting}
                style={{ backgroundColor: '#dc2626', border: 'none' }}
              >
                {deleting ? 'Deleting...' : 'Delete Employee'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployees;
