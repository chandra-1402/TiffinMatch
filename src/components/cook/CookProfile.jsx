import React, { useState, useEffect } from 'react';
import { Store, Camera } from 'lucide-react';
import { HOME_COOKS } from '../../data/mockData';

export default function CookProfile({ user }) {
  // Find initial mock data if available
  const mockCook = HOME_COOKS.find(c => c.uniqueId === user?.uniqueId);

  const [kitchenName, setKitchenName] = useState(mockCook?.name || user?.name || 'My Kitchen');
  const [kitchenLogo, setKitchenLogo] = useState(mockCook?.image || '');
  const [kitchenCuisine, setKitchenCuisine] = useState(mockCook?.cuisine || 'North Indian Homestyle');
  const [isSaving, setIsSaving] = useState(false);

  const savedLat = localStorage.getItem(`cook_lat_${user?.uniqueId}`);
  const savedLng = localStorage.getItem(`cook_lng_${user?.uniqueId}`);
  const gpsLocation = savedLat && savedLng ? `${parseFloat(savedLat).toFixed(4)}, ${parseFloat(savedLng).toFixed(4)}` : 'Location Offline (Visit Dashboard to sync)';

  useEffect(() => {
    // Load existing profile from backend
    if (user?.uniqueId) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      fetch(`${apiUrl}/api/cooks/profiles`)
        .then(res => res.json())
        .then(data => {
          if (data[user.uniqueId]) {
            setKitchenName(data[user.uniqueId].kitchenName || mockCook?.name || user.name);
            setKitchenLogo(data[user.uniqueId].kitchenLogo || mockCook?.image || '');
            setKitchenCuisine(data[user.uniqueId].kitchenCuisine || mockCook?.cuisine || 'North Indian Homestyle');
          }
        })
        .catch(err => console.error("Failed to load profile", err));
    }
  }, [user, mockCook]);

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

  const cuisines = [
    "North Indian Homestyle",
    "South Indian Authentic",
    "Punjabi Special",
    "Healthy & Diet Foods",
    "Bengali Delicacies",
    "Gujarati Thali",
    "Maharashtrian Cuisine",
    "Baking & Desserts"
  ];

  return (
    <div className="container" style={{ padding: '32px 0', maxWidth: '500px', margin: '0 auto' }}>
      <div className="capacity-controller-box" style={{ width: '100%', textAlign: 'center' }}>
        
        {/* Profile Avatar / Logo Upload */}
        <div style={{ marginBottom: '24px', position: 'relative', display: 'inline-block' }}>
          <input 
            type="file" 
            id="profile-upload" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  setKitchenLogo(event.target.result);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <label htmlFor="profile-upload" style={{ display: 'block', cursor: 'pointer' }}>
            <div 
              style={{
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                background: '#F1F5F9',
                border: '3px solid #059669',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                position: 'relative'
              }}
              title="Click to upload profile picture"
            >
              {kitchenLogo ? (
                <img src={kitchenLogo} alt="Kitchen Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Store size={48} color="#94A3B8" />
              )}
              
              {/* Overlay icon to hint it's clickable */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0,0,0,0.5)',
                padding: '6px 0',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Camera size={16} color="white" />
              </div>
            </div>
          </label>
        </div>
        
        <h3 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '8px' }}>Storefront Profile</h3>
        <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '24px' }}>Make your kitchen stand out to nearby customers.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
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
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>Live GPS Location</label>
            <div style={{ width: '100%', padding: '12px 16px', border: '1px solid #CBD5E1', borderRadius: 'var(--radius-sm)', background: '#F8FAFC', color: '#475569', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Store size={18} color="#059669" />
              {gpsLocation}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>Specialty / Cuisine</label>
            <select
              value={kitchenCuisine}
              onChange={(e) => setKitchenCuisine(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize: '1rem', background: 'white' }}
            >
              {cuisines.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
              {!cuisines.includes(kitchenCuisine) && (
                <option value={kitchenCuisine}>{kitchenCuisine}</option>
              )}
            </select>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            style={{ background: '#FF5520', color: 'white', padding: '14px 24px', borderRadius: 'var(--radius-sm)', border: 'none', fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer', marginTop: '16px', fontSize: '1rem', opacity: isSaving ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
