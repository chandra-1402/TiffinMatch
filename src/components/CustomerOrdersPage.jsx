import React from 'react';
import { Package, Clock, CheckCircle } from 'lucide-react';

export default function CustomerOrdersPage({ user, orders, onTrackOrder }) {
  // Get user orders (filter by customerId or customer name for backwards compatibility with mock data)
  const userOrders = orders.filter(
    (o) => o.customerId === user.uniqueId || o.customer?.includes(user.name) || o.customerName === user.name
  );

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '8px' }}>
        Your Orders
      </h1>
      <p style={{ color: '#64748B', marginBottom: '32px' }}>
        Track your live food deliveries and view past receipts.
      </p>

      {userOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#F8FAFC', borderRadius: 'var(--radius-lg)', border: '1px dashed #CBD5E1' }}>
          <Package size={48} color="#94A3B8" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#334155', marginBottom: '8px' }}>No orders yet</h3>
          <p style={{ color: '#64748B' }}>Your food tracking history will appear here once you place an order.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {userOrders.map((order) => {
            const isActive = order.status !== 'Delivered' && order.status !== 'Cancelled';
            return (
              <div key={order.id} style={{ 
                background: isActive ? '#FEFCE8' : '#ffffff', 
                border: `1px solid ${isActive ? '#FEF08A' : '#E2E8F0'}`,
                borderRadius: 'var(--radius-md)', 
                padding: '20px 24px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>
                    Order #{order.id} • {order.orderedAt}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                    {order.cook || order.cookName}
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '12px' }}>
                    {order.items}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: isActive ? '#D97706' : '#10B981', background: isActive ? '#FEF3C7' : '#D1FAE5', padding: '4px 12px', borderRadius: '999px' }}>
                    {isActive ? <Clock size={14} /> : <CheckCircle size={14} />}
                    Status: {order.status}
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                    ₹{order.price}
                  </div>
                  <button 
                    className={isActive ? 'btn-primary' : 'btn-secondary'}
                    style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                    onClick={() => onTrackOrder(order)}
                  >
                    {isActive ? 'Track Live Order' : 'View Receipt'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
