import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  ShoppingBag, 
  DollarSign, 
  ShieldCheck, 
  Power, 
  AlertCircle,
  Users,
  ChevronRight
} from 'lucide-react';
import { AI_DEMAND_PREDICTION } from '../data/mockData';

export default function HomeCookDashboard({ orders, onUpdateOrderStatus }) {
  const [kitchenOpen, setKitchenOpen] = useState(true);
  const [dailyCapacity, setDailyCapacity] = useState(30);
  const [bookedMeals, setBookedMeals] = useState(12);
  const [aiAccepted, setAiAccepted] = useState(false);

  const availableMeals = Math.max(0, dailyCapacity - bookedMeals);
  const capacityPercent = Math.min(100, Math.round((bookedMeals / dailyCapacity) * 100));

  const handleAcceptAiBatch = () => {
    setDailyCapacity(prev => prev + 10);
    setAiAccepted(true);
  };

  return (
    <div className="container cook-portal-container">
      {/* Cook Greeting & Kitchen State Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge-tag badge-capacity" style={{ marginBottom: '6px' }}>
            👩‍🍳 PARTNER HOME COOK PORTAL
          </div>
          <h1 style={{ fontSize: '2.1rem', color: '#0F172A', marginBottom: '4px' }}>
            Maa Ki Rasoi — Simran Kaur
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.92rem' }}>
            📍 Koramangala 5th Block Kitchen • Rated 4.8 ⭐ (342 orders delivered)
          </p>
        </div>

        {/* Kitchen Status Toggle */}
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

      {/* ================= 1. KITCHEN CAPACITY CONTROLLER ================= */}
      <div className="capacity-controller-box">
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

        {/* Progress Bar */}
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

        {/* Interactive Capacity Adjustment Slider */}
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

      {/* ================= 2. AI DEMAND PREDICTION WIDGET ================= */}
      <div className="demand-prediction-card">
        <div className="demand-prediction-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#16A34A" />
            <h3 style={{ fontSize: '1.2rem', color: '#14532D' }}>
              AI Demand Prediction & Proactive Matcher
            </h3>
          </div>
          <span className="badge-tag" style={{ background: '#DCFCE7', color: '#15803D', fontWeight: 700 }}>
            ⚡ {AI_DEMAND_PREDICTION.demandIntensity}
          </span>
        </div>

        <p style={{ fontSize: '0.92rem', color: '#166534', lineHeight: 1.5, marginBottom: '16px' }}>
          {AI_DEMAND_PREDICTION.cookActionPrompt}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '18px' }}>
          <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>PREDICTED PEAK WINDOW</div>
            <strong style={{ color: '#0F172A', fontSize: '0.95rem' }}>{AI_DEMAND_PREDICTION.predictedDemandPeak}</strong>
          </div>

          <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>TOP DEMAND DISH</div>
            <strong style={{ color: '#0F172A', fontSize: '0.95rem' }}>Dal Tadka + Phulkas</strong>
          </div>

          <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>EST. EXTRA PROFIT</div>
            <strong style={{ color: '#16A34A', fontSize: '1.05rem' }}>+₹{AI_DEMAND_PREDICTION.estimatedIncrementalRevenue}</strong>
          </div>
        </div>

        {aiAccepted ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803D', fontWeight: 700, fontSize: '0.9rem' }}>
            <CheckCircle2 size={18} />
            Capacity boosted by 10 meals! AI is routing local student lunch requests to your kitchen.
          </div>
        ) : (
          <button 
            className="btn-primary" 
            style={{ background: '#16A34A', boxShadow: '0 6px 18px rgba(22, 163, 74, 0.3)' }}
            onClick={handleAcceptAiBatch}
          >
            Accept AI Batch Suggestion (+10 slots)
          </button>
        )}
      </div>

      {/* ================= 3. ACTIVE ORDERS QUEUE & EARNINGS ================= */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '28px' }}>
        {/* Orders Queue */}
        <div className="order-queue-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={18} color="#FF5520" />
              Live Orders & Kitchen Queue ({orders.length})
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Auto-synced with Rider GPS</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {orders.map(order => (
              <div key={order.id} className="order-row-item">
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ color: '#0F172A', fontSize: '0.95rem' }}>{order.id}</strong>
                    <span>•</span>
                    <span style={{ fontSize: '0.88rem', color: '#475569' }}>Customer: {order.customer}</span>
                    <span 
                      className="badge-tag"
                      style={{ 
                        background: order.status === 'Delivered' ? '#ECFDF5' : '#FFF7ED',
                        color: order.status === 'Delivered' ? '#047857' : '#C2410C',
                        fontWeight: 700
                      }}
                    >
                      ● {order.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: '#64748B', marginBottom: '4px' }}>
                    {order.items} • ₹{order.price}
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>
                    📍 Delivery to: {order.deliveryAddress} ({order.orderedAt})
                  </div>
                </div>

                {/* Workflow Status Button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {order.status === 'Matched' && (
                    <button 
                      className="btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem', background: '#FF5520' }}
                      onClick={() => onUpdateOrderStatus(order.id, 'Cook Accepted')}
                    >
                      Accept Order
                    </button>
                  )}
                  {order.status === 'Cook Accepted' && (
                    <button 
                      className="btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem', background: '#D97706' }}
                      onClick={() => onUpdateOrderStatus(order.id, 'Simmering on Stove')}
                    >
                      Start Cooking
                    </button>
                  )}
                  {order.status === 'Simmering on Stove' && (
                    <button 
                      className="btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem', background: '#059669' }}
                      onClick={() => onUpdateOrderStatus(order.id, 'Packed & Ready for Rider')}
                    >
                      Mark Ready for Pickup
                    </button>
                  )}
                  {order.status === 'Packed & Ready for Rider' && (
                    <button 
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem', borderColor: '#10B981', color: '#059669' }}
                      onClick={() => onUpdateOrderStatus(order.id, 'Rider Dispatched')}
                    >
                      Handed to Delivery Rider
                    </button>
                  )}
                  {order.status === 'Rider Dispatched' && (
                    <button 
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem', borderColor: '#10B981', color: '#059669' }}
                      onClick={() => onUpdateOrderStatus(order.id, 'Delivered')}
                    >
                      Rider Delivered (Test)
                    </button>
                  )}
                  {order.status === 'Delivered' && (
                    <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={16} /> Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings & Compliance Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Earnings Card */}
          <div style={{ background: '#ffffff', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={18} color="#16A34A" />
              Kitchen Earnings
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>TODAY'S PAYOUT</div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-display)' }}>
                ₹1,440
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
              <strong>₹62.50</strong>
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
    </div>
  );
}
