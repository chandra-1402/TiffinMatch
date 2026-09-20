import React, { useState } from 'react';
import { Sparkles, TrendingUp, Users, ShoppingBag, CheckCircle2 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { AI_DEMAND_PREDICTION } from '../../data/mockData';

// Mock data for the chart to visualize the demand spike
const demandData = [
  { time: '10:00 AM', demand: 12 },
  { time: '11:00 AM', demand: 25 },
  { time: '12:00 PM', demand: 45 },
  { time: '1:00 PM', demand: 85 }, // Peak
  { time: '2:00 PM', demand: 60 },
  { time: '3:00 PM', demand: 20 },
];

export default function CookHome({ user, orders }) {
  const [aiAccepted, setAiAccepted] = useState(false);

  // Calculate real stats from orders
  const myOrders = orders.filter(o => o.cook === user?.name);
  const activeOrdersCount = myOrders.filter(o => o.status !== 'Delivered').length;
  const deliveredOrders = myOrders.filter(o => o.status === 'Delivered');
  const todaysRevenue = deliveredOrders.reduce((sum, o) => sum + parseFloat(o.price || 0), 0);
  const totalDeliveredCount = deliveredOrders.length;

  return (
    <div className="container" style={{ padding: '32px 0' }}>
      
      {/* 1. Dynamic Welcome Hero Banner */}
      <div className="cook-hero-banner">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="badge-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', marginBottom: '16px' }}>
            👩‍🍳 PARTNER KITCHEN
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'white', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Welcome back, {user?.name.split(' ')[0]}!
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1.05rem', maxWidth: '600px', marginBottom: '32px' }}>
            You have successfully delivered <strong>{totalDeliveredCount} orders</strong>. You're doing amazing! Here's a snapshot of your kitchen's performance today.
          </p>
          
          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '700px' }}>
            <div className="cook-stat-glass">
              <div className="cook-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShoppingBag size={14} color="#FFD0C2" /> Active Orders
              </div>
              <div className="cook-stat-value">{activeOrdersCount}</div>
            </div>
            
            <div className="cook-stat-glass">
              <div className="cook-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={14} color="#FFD0C2" /> Total Revenue
              </div>
              <div className="cook-stat-value">₹{todaysRevenue}</div>
            </div>

            <div className="cook-stat-glass">
              <div className="cook-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#FFD0C2" /> Delivered Meals
              </div>
              <div className="cook-stat-value">{totalDeliveredCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI Demand Predictor & Graph */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        
        {/* Graph Section */}
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '28px', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '4px' }}>Local Demand Forecast</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B' }}>Live student lunch demand in your 1.5km zone</p>
            </div>
            <span className="badge-tag" style={{ background: '#DCFCE7', color: '#15803D', border: 'none' }}>
              ⚡ {AI_DEMAND_PREDICTION.demandIntensity}
            </span>
          </div>
          
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="demand" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Action Card */}
        <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', border: '2px solid #BBF7D0', borderRadius: 'var(--radius-lg)', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 25px rgba(22, 163, 74, 0.1)' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sparkles size={24} color="#16A34A" />
              <h2 style={{ fontSize: '1.4rem', color: '#14532D', letterSpacing: '-0.02em' }}>Proactive Matcher</h2>
            </div>
            <p style={{ fontSize: '1.05rem', color: '#166534', lineHeight: 1.5, marginBottom: '24px' }}>
              {AI_DEMAND_PREDICTION.cookActionPrompt}
            </p>

            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '4px' }}>PREDICTED PEAK</div>
              <div style={{ fontSize: '1.1rem', color: '#0F172A', fontWeight: 600 }}>{AI_DEMAND_PREDICTION.predictedDemandPeak}</div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '4px' }}>EST. EXTRA PROFIT</div>
              <div style={{ fontSize: '1.5rem', color: '#16A34A', fontWeight: 800 }}>+₹{AI_DEMAND_PREDICTION.estimatedIncrementalRevenue}</div>
            </div>
          </div>

          {aiAccepted ? (
            <div style={{ background: '#16A34A', color: 'white', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <CheckCircle2 size={24} style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '4px', fontSize: '1.05rem' }}>Capacity Boosted!</strong>
                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>AI is routing local student lunch requests to your kitchen.</span>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setAiAccepted(true)}
              style={{
                background: '#16A34A',
                color: 'white',
                padding: '18px',
                borderRadius: 'var(--radius-md)',
                fontSize: '1.05rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(22, 163, 74, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Accept AI Suggestion (+10 slots)
            </button>
          )}

        </div>
      </div>

    </div>
  );
}
