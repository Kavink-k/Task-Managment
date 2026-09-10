import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EmployeeModal = ({ isOpen, onClose, onSuccess, employeeToEdit }) => {
  const { showToast } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!employeeToEdit;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        name: employeeToEdit.name || '',
        email: employeeToEdit.email || '',
        password: '' // Blank password means unchanged in edit mode
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: ''
      });
    }
    setErrors({});
  }, [employeeToEdit, isOpen]);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'New password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEditMode) {
        const payload = {
          name: formData.name,
          email: formData.email
        };
        if (formData.password.trim()) {
          payload.password = formData.password;
        }

        await api.put(`/employees/${employeeToEdit._id}`, payload);
        showToast('Employee updated successfully!', 'success');
      } else {
        await api.post('/employees', formData);
        showToast('Employee created successfully!', 'success');
      }

      onSuccess();
      onClose();
    } catch (error) {
      const msg = error.response?.data?.message || 'Operation failed. Please try again.';
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
          <h3 className="modal-title">
            {isEditMode ? 'Edit Employee Credentials' : 'Add New Employee'}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Employee Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Alex Morgan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="alex.morgan@taskflow.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                {isEditMode ? 'New Password (Leave blank to keep unchanged)' : 'Password *'}
              </label>
              <input
                type="password"
                className="form-input"
                placeholder={isEditMode ? '••••••••' : 'At least 6 characters'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
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
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  {isEditMode ? <Save size={16} /> : <UserPlus size={16} />}
                  <span>{isEditMode ? 'Update Employee' : 'Add Employee'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
