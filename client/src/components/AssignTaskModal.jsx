import React, { useState, useEffect } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AssignTaskModal = ({ isOpen, onClose, onSuccess }) => {
  const { showToast } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await api.get('/employees');
      setEmployees(response.data.employees || []);
      if (response.data.employees?.length > 0) {
        setFormData((prev) => ({ ...prev, assignedTo: response.data.employees[0]._id }));
      }
    } catch (error) {
      showToast('Failed to load employee list', 'error');
    } finally {
      setLoadingEmployees(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please select an employee';
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.post('/tasks', formData);
      showToast('Task assigned successfully!', 'success');
      setFormData({
        title: '',
        description: '',
        assignedTo: employees[0]?._id || '',
        priority: 'Medium'
      });
      setErrors({});
      onSuccess();
      onClose();
    } catch (error) {
      const msg = error.response?.data?.message || 'Unable to assign task';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">Assign New Task</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Implement JWT Auth Middleware"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                placeholder="Provide detailed instructions for the employee..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Assign To Employee *</label>
              {loadingEmployees ? (
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Loading employees...</div>
              ) : (
                <select
                  className="form-select"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                >
                  {employees.length === 0 ? (
                    <option value="">No employees found</option>
                  ) : (
                    employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.email})
                      </option>
                    ))
                  )}
                </select>
              )}
              {errors.assignedTo && <div className="form-error">{errors.assignedTo}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Priority *</label>
              <select
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              {errors.priority && <div className="form-error">{errors.priority}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || loadingEmployees || employees.length === 0}
            >
              {submitting ? (
                <span>Assigning...</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>Assign Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskModal;
