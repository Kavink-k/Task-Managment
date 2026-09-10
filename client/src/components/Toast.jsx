import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Toast = () => {
  const { toast } = useAuth();

  if (!toast) return null;

  const { message, type } = toast;

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  return (
    <div className="toast-container">
      <div className={`toast toast-${type}`}>
        {icons[type] || icons.info}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
