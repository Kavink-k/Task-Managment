import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import Toast from '../components/Toast';

const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/employee/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/employee/dashboard', { replace: true });
      }
    }
  };

  const fillDemoCredentials = (type) => {
    if (type === 'admin') {
      setEmail('admin@taskflow.com');
      setPassword('AdminPass123!');
    } else if (type === 'emp1') {
      setEmail('john.doe@taskflow.com');
      setPassword('EmpPass123!');
    } else if (type === 'emp2') {
      setEmail('jane.smith@taskflow.com');
      setPassword('EmpPass123!');
    }
    setErrors({});
  };

  return (
    <div className="login-wrapper">
      <Toast />

      {/* Brand Panel */}
      <div className="login-brand-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="brand-logo" style={{ width: '44px', height: '44px', fontSize: '1.25rem' }}>TF</div>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>TaskFlow</span>
        </div>

        <div className="login-brand-content">
          <h1 className="login-brand-title">Enterprise Task & Workflow Orchestration</h1>
          <p className="login-brand-desc">
            Seamlessly assign tasks, track progress in real-time, get instant automated notifications, and streamline team productivity with robust role-based access control.
          </p>
        </div>

        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          &copy; {new Date().getFullYear()} TaskFlow System &bull; Xplore Intellects Internship Assessment
        </div>
      </div>

      {/* Form Panel */}
      <div className="login-form-panel">
        <div className="login-form-box">
          <div className="login-header">
            <h2 className="login-title">Sign in to TaskFlow</h2>
            <p className="login-subtitle">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@taskflow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '8px' }}
            >
              {submitting ? (
                'Signing in...'
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="demo-credentials-card">
            <div className="demo-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#2563eb" />
              <span>Quick Demo Accounts (Click to Fill)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => fillDemoCredentials('admin')}
                style={{ fontSize: '0.8125rem', padding: '6px 10px', justifyContent: 'space-between' }}
              >
                <span>👑 <strong>Admin:</strong> admin@taskflow.com</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>AdminPass123!</span>
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => fillDemoCredentials('emp1')}
                style={{ fontSize: '0.8125rem', padding: '6px 10px', justifyContent: 'space-between' }}
              >
                <span>👤 <strong>Employee 1:</strong> john.doe@taskflow.com</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>EmpPass123!</span>
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => fillDemoCredentials('emp2')}
                style={{ fontSize: '0.8125rem', padding: '6px 10px', justifyContent: 'space-between' }}
              >
                <span>👤 <strong>Employee 2:</strong> jane.smith@taskflow.com</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>EmpPass123!</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
