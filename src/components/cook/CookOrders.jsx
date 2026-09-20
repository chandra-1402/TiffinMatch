import React from 'react';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';

export default function CookOrders({ orders, onUpdateOrderStatus }) {
  return (
    <div className="container" style={{ padding: '32px 0' }}>
      <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '28px' }}>Live Orders & Processing</h1>
      
      <div className="order-queue-card" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} color="#FF5520" />
            Live Orders & Kitchen Queue ({orders.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Auto-synced with Rider GPS</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {orders.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>No active orders.</div>
          ) : (
            orders.map(order => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
