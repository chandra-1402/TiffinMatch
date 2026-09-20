import React from 'react';
import { DollarSign, ShieldCheck } from 'lucide-react';

export default function CookEarnings({ user, orders }) {
  // Real active orders count
  const myOrders = orders.filter(o => o.cook === user?.name);
  const deliveredOrders = myOrders.filter(o => o.status === 'Delivered');
  const todaysRevenue = deliveredOrders.reduce((sum, o) => sum + parseFloat(o.price || 0), 0);
  const avgProfitPerMeal = deliveredOrders.length > 0 ? (todaysRevenue / deliveredOrders.length).toFixed(2) : '0.00';

  return (
    <div className="container" style={{ padding: '32px 0' }}>
      <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '28px' }}>Earnings & Compliance</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '800px' }}>
        {/* Earnings Card */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={18} color="#16A34A" />
            Kitchen Earnings
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>TODAY'S PAYOUT</div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-display)' }}>
              ₹{todaysRevenue}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#059669' }}>
              +14% higher than last Tuesday
            </div>
          </div>

          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
            <span style={{ color: '#64748B' }}>This Week:</span>
            <strong>₹9,800</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginTop: '6px' }}>
            <span style={{ color: '#64748B' }}>Avg Profit / Meal:</span>
            <strong>₹{avgProfitPerMeal}</strong>
          </div>
        </div>

        {/* Hygiene & Verification Badge */}
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck size={20} color="#059669" />
            <strong style={{ color: '#065F46', fontSize: '0.92rem' }}>
              Hygiene & Safety Verified
            </strong>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#047857', lineHeight: 1.45, marginBottom: '12px' }}>
            Your kitchen scored 98% in the latest inspection. Filter maintenance is up to date.
          </p>
          <div style={{ fontSize: '0.75rem', color: '#065F46', fontWeight: 600 }}>
            FSSAI Reg: #21226008000412 (Active)
          </div>
        </div>
      </div>
    </div>
  );
}
