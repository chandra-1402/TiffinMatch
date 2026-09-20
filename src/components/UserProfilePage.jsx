import React, { useState, useRef } from 'react';
import { User, Lock, Save, Camera, ShieldCheck } from 'lucide-react';

export default function UserProfilePage({ user, onUpdateUser }) {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState('password123'); // Default mock password, actual usually fetched differently or left blank for security
  const [profilePic, setProfilePic] = useState(user.profilePic || null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await fetch('http://localhost:3001/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uniqueId: user.uniqueId,
          name,
          password,
          profilePic
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        onUpdateUser(data.user);
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', padding: '40px 20px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#0F172A', marginBottom: '8px' }}>
          Profile Settings
        </h1>
        <p style={{ color: '#64748B' }}>Update your personal information and security details.</p>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
        
        {/* Avatar Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div 
            style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              background: profilePic ? `url(${profilePic}) center/cover` : '#F1F5F9',
              border: '2px dashed #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginBottom: '12px',
              position: 'relative'
            }}
            onClick={() => fileInputRef.current.click()}
          >
            {!profilePic && <User size={40} color="#94A3B8" />}
            <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#FF5520', padding: '6px', borderRadius: '50%', color: 'white' }}>
              <Camera size={14} />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }}
          />
          <button 
            style={{ background: 'none', border: 'none', color: '#FF5520', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
            onClick={() => fileInputRef.current.click()}
          >
            Change Profile Picture
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1E293B', fontSize: '0.9rem' }}>
              Unique ID (Fixed)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
              <ShieldCheck size={18} color="#64748B" style={{ marginRight: '10px' }} />
              <input 
                type="text" 
                value={user.uniqueId} 
                disabled
                style={{ border: 'none', background: 'transparent', outline: 'none', color: '#64748B', width: '100%', fontWeight: 500 }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>Your unique identifier cannot be changed.</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1E293B', fontSize: '0.9rem' }}>
              Full Name
            </label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #CBD5E1', borderRadius: 'var(--radius-sm)', padding: '10px 14px', transition: 'border 0.2s' }}>
              <User size={18} color="#64748B" style={{ marginRight: '10px' }} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ border: 'none', outline: 'none', color: '#0F172A', width: '100%', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1E293B', fontSize: '0.9rem' }}>
              Password
            </label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #CBD5E1', borderRadius: 'var(--radius-sm)', padding: '10px 14px', transition: 'border 0.2s' }}>
              <Lock size={18} color="#64748B" style={{ marginRight: '10px' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ border: 'none', outline: 'none', color: '#0F172A', width: '100%', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '14px' }}
            disabled={loading}
          >
            {loading ? 'Saving...' : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </form>

        {successMsg && (
          <div style={{ marginTop: '20px', padding: '12px', background: '#ECFDF5', color: '#047857', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid #A7F3D0', fontWeight: 500 }}>
            {successMsg}
          </div>
        )}
      </div>
    </div>
  );
}
