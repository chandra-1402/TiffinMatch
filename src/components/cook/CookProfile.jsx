import React, { useState } from 'react';
import { Store } from 'lucide-react';

export default function CookProfile({ user }) {
  const [kitchenName, setKitchenName] = useState(user?.name || 'My Kitchen');
  const [kitchenLogo, setKitchenLogo] = useState('');
  const [kitchenCuisine, setKitchenCuisine] = useState('');

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
          <button style={{ background: '#FF5520', color: 'white', padding: '14px 24px', borderRadius: 'var(--radius-sm)', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: '16px', fontSize: '1rem' }}>
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
