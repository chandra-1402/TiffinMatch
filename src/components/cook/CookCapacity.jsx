import React, { useState } from 'react';
import { Flame, Power } from 'lucide-react';

export default function CookCapacity({ user, orders }) {
  const [kitchenOpen, setKitchenOpen] = useState(true);
  const [dailyCapacity, setDailyCapacity] = useState(30);
  
  // Real active orders count
  const myOrders = orders.filter(o => o.cook === user?.name);
  const bookedMeals = myOrders.filter(o => o.status !== 'Delivered').length;

  const availableMeals = Math.max(0, dailyCapacity - bookedMeals);
  const capacityPercent = Math.min(100, Math.round((bookedMeals / dailyCapacity) * 100));

  return (
    <div className="container" style={{ padding: '32px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#0F172A' }}>Kitchen Capacity Dashboard</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setKitchenOpen(!kitchenOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: kitchenOpen ? '#ECFDF5' : '#FEF2F2',
              color: kitchenOpen ? '#047857' : '#B91C1C',
              border: `1.5px solid ${kitchenOpen ? '#A7F3D0' : '#FECACA'}`
            }}
          >
            <Power size={16} />
            {kitchenOpen ? 'Kitchen Open & Accepting' : 'Kitchen Paused (Full)'}
          </button>
        </div>
      </div>

      <div className="capacity-controller-box" style={{ maxWidth: '800px' }}>
        <div className="capacity-status-row">
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={20} color="#FF5520" />
              Kitchen Capacity Monetization Engine
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#64748B' }}>
              Control your stove capacity to prevent cooking overwhelm and guarantee homestyle freshness.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-display)' }}>
              {availableMeals}
            </span>
            <span style={{ color: '#64748B', fontSize: '0.9rem' }}> / {dailyCapacity} slots left today</span>
          </div>
        </div>

        <div className="capacity-meter-bar">
          <div 
            className="capacity-meter-fill"
            style={{ width: `${capacityPercent}%` }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748B', marginBottom: '20px' }}>
          <span>{bookedMeals} meals ordered & simmering ({capacityPercent}% utilized)</span>
          <span>{availableMeals} spare meals can be taken</span>
        </div>

        <div style={{ background: '#FAF8F5', padding: '16px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid #EBE5DB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1E293B' }}>
              Adjust Today's Maximum Cooking Limit:
            </label>
            <strong style={{ color: '#FF5520' }}>{dailyCapacity} Meals</strong>
          </div>
          <input 
            type="range" 
            min="15" 
            max="60" 
            step="5"
            value={dailyCapacity}
            onChange={(e) => setDailyCapacity(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748B', marginTop: '4px' }}>
            <span>15 meals (Light day)</span>
            <span>30 meals (Balanced)</span>
            <span>60 meals (Full weekend capacity)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
