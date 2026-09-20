import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  ChefHat, 
  User,
  Lock, 
  KeyRound, 
  AlertCircle, 
  UserPlus
} from 'lucide-react';
import { REGISTERED_ACCOUNTS } from '../data/mockData';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  targetPortal, // 'customer' | 'cook' | 'admin'
  onSuccessLogin 
}) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  
  // Login State
  const [uniqueId, setUniqueId] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [loginRole, setLoginRole] = useState(targetPortal || 'customer');
  
  // Signup State
  const [signupRole, setSignupRole] = useState('customer'); // 'customer' | 'cook'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [signupUniqueId, setSignupUniqueId] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleFillDemo = () => {
    if (loginRole === 'cook') {
      setUniqueId(REGISTERED_ACCOUNTS.cook.uniqueId);
      setSecretKey(REGISTERED_ACCOUNTS.cook.pin);
    } else if (loginRole === 'admin') {
      setUniqueId(REGISTERED_ACCOUNTS.admin.uniqueId);
      setSecretKey(REGISTERED_ACCOUNTS.admin.passcode);
    } else {
      setUniqueId(REGISTERED_ACCOUNTS.customer.uniqueId);
      setSecretKey('password123'); // Demo customer password
    }
    setErrorMessage('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uniqueId: uniqueId.trim(),
          password: secretKey.trim(),
          role: loginRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccessLogin(data.user);
        onClose();
      } else {
        setErrorMessage(data.error || 'Failed to login');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error: Unable to connect to server');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !phone || !signupUniqueId || !signupPassword || !signupConfirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uniqueId: signupUniqueId.trim(),
          password: signupPassword,
          name,
          phone,
          role: signupRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccessLogin(data.user);
        onClose();
      } else {
        setErrorMessage(data.error || 'Failed to sign up');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error: Unable to connect to server');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '30px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Header Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '2px solid #F1F5F9' }}>
          <button 
            style={{ 
              flex: 1, 
              padding: '12px', 
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'login' ? '3px solid #4F46E5' : '3px solid transparent',
              color: activeTab === 'login' ? '#0F172A' : '#64748B',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('login')}
          >
            Log In
          </button>
          <button 
            style={{ 
              flex: 1, 
              padding: '12px', 
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'signup' ? '3px solid #4F46E5' : '3px solid transparent',
              color: activeTab === 'signup' ? '#0F172A' : '#64748B',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {activeTab === 'login' && (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button 
                onClick={() => setLoginRole('customer')}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: `1px solid ${loginRole === 'customer' ? '#4F46E5' : '#CBD5E1'}`, background: loginRole === 'customer' ? '#EEF2FF' : '#FFF', color: loginRole === 'customer' ? '#4F46E5' : '#475569', fontSize: '0.85rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
              >
                <User size={14} /> Customer
              </button>
              <button 
                onClick={() => setLoginRole('cook')}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: `1px solid ${loginRole === 'cook' ? '#D97706' : '#CBD5E1'}`, background: loginRole === 'cook' ? '#FEF3C7' : '#FFF', color: loginRole === 'cook' ? '#D97706' : '#475569', fontSize: '0.85rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
              >
                <ChefHat size={14} /> Cook
              </button>
              <button 
                onClick={() => setLoginRole('admin')}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: `1px solid ${loginRole === 'admin' ? '#047857' : '#CBD5E1'}`, background: loginRole === 'admin' ? '#ECFDF5' : '#FFF', color: loginRole === 'admin' ? '#047857' : '#475569', fontSize: '0.85rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
              >
                <ShieldCheck size={14} /> Admin
              </button>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#334155' }}>Use Demo Credentials for quick access.</div>
              <button type="button" className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={handleFillDemo}>Auto-Fill</button>
            </div>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">Unique ID</label>
                <input 
                  type="text" 
                  className="filter-input"
                  style={{ width: '100%', padding: '10px 14px', textTransform: 'uppercase' }}
                  placeholder="e.g. CUST-XXXX-0000"
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Password / PIN</label>
                <input 
                  type="password" 
                  className="filter-input"
                  style={{ width: '100%', padding: '10px 14px' }}
                  placeholder="••••••••"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  required
                />
              </div>
              
              {errorMessage && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: '0.82rem', padding: '10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} /><span>{errorMessage}</span>
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
                <KeyRound size={16} /> Log In
              </button>
            </form>
          </div>
        )}

        {activeTab === 'signup' && (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button 
                onClick={() => setSignupRole('customer')}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: `1px solid ${signupRole === 'customer' ? '#4F46E5' : '#CBD5E1'}`, background: signupRole === 'customer' ? '#EEF2FF' : '#FFF', color: signupRole === 'customer' ? '#4F46E5' : '#475569', fontSize: '0.85rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
              >
                <User size={14} /> I want to order food
              </button>
              <button 
                onClick={() => setSignupRole('cook')}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: `1px solid ${signupRole === 'cook' ? '#D97706' : '#CBD5E1'}`, background: signupRole === 'cook' ? '#FEF3C7' : '#FFF', color: signupRole === 'cook' ? '#D97706' : '#475569', fontSize: '0.85rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
              >
                <ChefHat size={14} /> I want to sell food
              </button>
            </div>

            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="filter-input"
                  style={{ width: '100%', padding: '10px 14px' }}
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  className="filter-input"
                  style={{ width: '100%', padding: '10px 14px' }}
                  placeholder="e.g. +91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Unique ID</label>
                <input 
                  type="text" 
                  className="filter-input"
                  style={{ width: '100%', padding: '10px 14px', textTransform: 'uppercase' }}
                  placeholder={signupRole === 'cook' ? 'e.g. COOK-NAME-1234' : 'e.g. CUST-NAME-1234'}
                  value={signupUniqueId}
                  onChange={(e) => setSignupUniqueId(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Password / PIN</label>
                <input 
                  type="password" 
                  className="filter-input"
                  style={{ width: '100%', padding: '10px 14px' }}
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Confirm Password</label>
                <input 
                  type="password" 
                  className="filter-input"
                  style={{ width: '100%', padding: '10px 14px' }}
                  placeholder="••••••••"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {errorMessage && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: '0.82rem', padding: '10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} /><span>{errorMessage}</span>
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px', background: signupRole === 'cook' ? '#D97706' : '#4F46E5' }}>
                <UserPlus size={16} /> Create Account
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
