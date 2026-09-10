import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Forbidden = () => {
  const { user } = useAuth();
  const homePath = user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        padding: '20px'
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}
      >
        <ShieldAlert size={56} color="#dc2626" style={{ margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
          403 - Access Denied
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: '24px' }}>
          You do not have administrative permissions to view this section or perform this action.
        </p>

        <Link to={homePath} className="btn-primary" style={{ justifyContent: 'center', width: '100%' }}>
          <ArrowLeft size={18} />
          <span>Return to My Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
