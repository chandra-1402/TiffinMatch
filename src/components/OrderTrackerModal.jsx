import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Bike, 
  Sparkles, 
  MapPin, 
  Phone,
  ShieldCheck
} from 'lucide-react';

export default function OrderTrackerModal({ order, onClose }) {
  if (!order) return null;

  const [step, setStep] = useState(1);
  const [liveOrder, setLiveOrder] = useState(order);

  useEffect(() => {
    // Initial fetch and polling every 3 seconds
    const fetchOrderStatus = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/order/${order.id}`);
        const data = await res.json();
        if (data.order) {
          setLiveOrder(data.order);
          // Map backend status to UI steps
          const status = data.order.status;
          if (status === 'Delivered') setStep(5);
          else if (status.includes('Rider') || status === 'Dispatched') setStep(4);
          else if (status.includes('Simmering') || status.includes('Packed')) setStep(3);
          else if (status.includes('Accepted') || status.includes('Confirmed')) setStep(2);
          else setStep(1); // Pending / Matched
        }
      } catch (err) {
        console.error("Error fetching live order status", err);
      }
    };

    fetchOrderStatus(); // Fetch immediately
    const interval = setInterval(fetchOrderStatus, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [order.id]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="badge-tag badge-emerald" style={{ marginBottom: '8px' }}>
            <Sparkles size={14} />
            LIVE ORDER TRACKING
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#0F172A', marginBottom: '4px' }}>
            Order #{order.id}
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.88rem' }}>
            Matched with <strong>{order.cook}</strong>
          </p>
        </div>

        {/* Estimated Time Card */}
        <div 
          style={{ 
            background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)', 
            border: '1.5px solid #FDE68A', 
            borderRadius: 'var(--radius-md)', 
            padding: '16px 20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '28px' 
          }}
        >
          <div>
            <div style={{ fontSize: '0.76rem', color: '#B45309', fontWeight: 700, textTransform: 'uppercase' }}>
              Estimated Delivery
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#92400E' }}>
              {step >= 4 ? '12 – 15 Mins' : '20 – 24 Mins'}
            </div>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
            <Clock size={24} />
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="order-tracker-timeline">
          {/* Step 1 */}
          <div className={`tracker-node ${step >= 1 ? 'completed' : ''}`}>
            <div className="tracker-icon">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>
                AI Matched Demand to Kitchen
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Allocated to nearest available stove slot
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className={`tracker-node ${step >= 2 ? (step === 2 ? 'current' : 'completed') : ''}`}>
            <div className="tracker-icon">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>
                Cook Simran Confirmed
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Fresh ingredients gathered from 6 AM market haul
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className={`tracker-node ${step >= 3 ? (step === 3 ? 'current' : 'completed') : ''}`}>
            <div className="tracker-icon">
              <Flame size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>
                Simmering on Stove & Hot Packing
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Phulkas puffed on tawa and brushed with desi ghee
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className={`tracker-node ${step >= 4 ? (step === 4 ? 'current' : 'completed') : ''}`}>
            <div className="tracker-icon">
              <Bike size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>
                Rider Dispatched (Eco-Delivery)
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Rider Rajesh picked up insulated tiffin box (1.2 km away)
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Summary */}
        <div style={{ background: '#FAF8F5', border: '1px solid #EBE5DB', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginTop: '20px', fontSize: '0.84rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#64748B' }}>Items:</span>
            <strong style={{ color: '#0F172A' }}>{order.items}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#64748B' }}>Delivery Address:</span>
            <span>{order.deliveryAddress}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748B' }}>Total Paid:</span>
            <strong style={{ color: '#FF5520' }}>₹{order.price}</strong>
          </div>
        </div>

        <button 
          className="btn-primary" 
          style={{ width: '100%', marginTop: '20px', padding: '12px' }}
          onClick={onClose}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
