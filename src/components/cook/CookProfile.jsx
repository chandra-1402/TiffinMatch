import React, { useState, useEffect } from 'react';
import { Store } from 'lucide-react';

export default function CookProfile({ user }) {
  const [kitchenName, setKitchenName] = useState(user?.name || 'My Kitchen');
  const [kitchenLogo, setKitchenLogo] = useState('');
  const [kitchenCuisine, setKitchenCuisine] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load existing profile from backend
    if (user?.uniqueId) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      fetch(`${apiUrl}/api/cooks/profiles`)
        .then(res => res.json())
        .then(data => {
          if (data[user.uniqueId]) {
            setKitchenName(data[user.uniqueId].kitchenName || user.name);
            setKitchenLogo(data[user.uniqueId].kitchenLogo || '');
            setKitchenCuisine(data[user.uniqueId].kitchenCuisine || '');
          }
        })
        .catch(err => console.error("Failed to load profile", err));
    }
  }, [user]);

  const handleSave = () => {
    if (!user?.uniqueId) return;
    setIsSaving(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/api/cooks/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uniqueId: user.uniqueId,
        kitchenName,
        kitchenLogo,
        kitchenCuisine
      })
    })
    .then(res => res.json())
    .then(() => {
      setIsSaving(false);
      alert('Profile saved successfully! Customers can now see your updated storefront.');
    })
    .catch(err => {
      console.error(err);
      setIsSaving(false);
      alert('Failed to save profile.');
    });
  };

  return (
    <div className="container" style={{ padding: '32px 0', maxWidth: '600px', margin: '0 auto' }}>
      <div className="capacity-controller-box" style={{ width: '100%' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Store size={24} color="#059669" />
          Storefront Profile
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>Kitchen Name</label>
            <input 
              type="text" 
              value={kitchenName} 
              onChange={(e) => setKitchenName(e.target.value)} 
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '1rem' }} 
              placeholder="e.g. Maa Ki Rasoi" 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>Cover Image URL</label>
            <input 
              type="text" 
              value={kitchenLogo} 
              onChange={(e) => setKitchenLogo(e.target.value)} 
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '1rem' }} 
              placeholder="https://example.com/logo.jpg" 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>Specialty / Cuisine</label>
            <input 
              type="text" 
              value={kitchenCuisine} 
              onChange={(e) => setKitchenCuisine(e.target.value)} 
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '1rem' }} 
              placeholder="e.g. Authentic North Indian" 
            />
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            style={{ background: '#FF5520', color: 'white', padding: '14px 24px', borderRadius: 'var(--radius-sm)', border: 'none', fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer', marginTop: '16px', fontSize: '1rem', opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
