import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Clock, 
  Flame,
  Award,
  ShoppingBag
} from 'lucide-react';

export default function CookProfileModal({ cook, onClose, onAddToCart }) {
  const [quantities, setQuantities] = useState({});
  const [activeTab, setActiveTab] = useState('menu'); // 'menu', 'hygiene', 'reviews'

  if (!cook) return null;

  const handleIncrement = (itemId) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const handleDecrement = (itemId) => {
    setQuantities(prev => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: current - 1 };
    });
  };

  const handleAddItemsToCart = () => {
    Object.entries(quantities).forEach(([itemId, qty]) => {
      const menuItem = cook.menu.find(m => m.id === itemId);
      if (menuItem && qty > 0) {
        onAddToCart(menuItem, cook, qty);
      }
    });
    onClose();
  };

  const totalSelectedItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalAmount = Object.entries(quantities).reduce((sum, [itemId, qty]) => {
    const menuItem = cook.menu.find(m => m.id === itemId);
    return sum + (menuItem ? menuItem.price * qty : 0);
  }, 0);

  // Capacity percentage calculation
  const capacityPercent = Math.round((cook.bookedCapacity / cook.dailyCapacity) * 100);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Cook Header & Avatar */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          <img 
            src={cook.cookAvatar} 
            alt={cook.cookName}
            style={{ 
              width: '90px', 
              height: '90px', 
              borderRadius: '50%', 
              objectFit: 'cover', 
              border: '3px solid #FF5520',
              boxShadow: '0 4px 14px rgba(255, 85, 32, 0.2)'
            }}
          />

          <div style={{ flexGrow: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.6rem', color: '#0F172A' }}>{cook.name}</h2>
              <div className="rating-badge">
                <Star size={13} fill="#D97706" color="#D97706" />
                {cook.rating} / 5
              </div>
            </div>

            <div style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '6px' }}>
              By <strong>{cook.cookName}</strong> ({cook.experienceYears} yrs experience) • 📍 {cook.locality} ({cook.distanceKm} km away)
            </div>

            <p style={{ fontSize: '0.88rem', color: '#334155', fontStyle: 'italic' }}>
              "{cook.tagline}"
            </p>
          </div>
        </div>

        {/* Real-time Kitchen Capacity Controller / Status Bar */}
        <div 
          style={{ 
            background: '#FAF8F5', 
            border: '1px solid #EBE5DB', 
            borderRadius: 'var(--radius-md)', 
            padding: '16px 20px', 
            marginBottom: '20px' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={16} color="#FF5520" />
              Today's Kitchen Capacity
            </div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#059669' }}>
              {cook.availableCapacity} / {cook.dailyCapacity} meals available
            </div>
          </div>

          <div className="capacity-meter-bar" style={{ height: '10px', margin: 0 }}>
            <div 
              className="capacity-meter-fill" 
              style={{ width: `${capacityPercent}%`, background: 'linear-gradient(90deg, #10B981, #F59E0B)' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748B', marginTop: '6px' }}>
            <span>{cook.bookedCapacity} meals prepared & cooking</span>
            <span>Delivery Radius: Up to {cook.deliveryRadiusKm} km</span>
          </div>
        </div>

        {/* Verification Status Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div 
            style={{ 
              background: '#ECFDF5', 
              border: '1px solid #A7F3D0', 
              borderRadius: 'var(--radius-sm)', 
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <ShieldCheck size={22} color="#059669" />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#065F46' }}>
                Hygiene Profile
              </div>
              <div style={{ fontSize: '0.75rem', color: '#047857' }}>
                ✓ Verified (Score: {cook.hygieneScore}%)
              </div>
            </div>
          </div>

          <div 
            style={{ 
              background: '#EFF6FF', 
              border: '1px solid #BFDBFE', 
              borderRadius: 'var(--radius-sm)', 
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Award size={22} color="#2563EB" />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E40AF' }}>
                Food Safety Compliance
              </div>
              <div style={{ fontSize: '0.75rem', color: '#1D4ED8' }}>
                ✓ Documentation verified
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Menu / Hygiene / Reviews */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: '20px' }}>
          <button 
            className={`nav-link-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
            style={{ paddingBottom: '10px', borderRadius: 0, borderBottom: activeTab === 'menu' ? '2px solid #FF5520' : 'none' }}
          >
            Daily Homestyle Menu
          </button>
          <button 
            className={`nav-link-btn ${activeTab === 'hygiene' ? 'active' : ''}`}
            onClick={() => setActiveTab('hygiene')}
            style={{ paddingBottom: '10px', borderRadius: 0, borderBottom: activeTab === 'hygiene' ? '2px solid #FF5520' : 'none' }}
          >
            Hygiene & Kitchen Standards
          </button>
          <button 
            className={`nav-link-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
            style={{ paddingBottom: '10px', borderRadius: 0, borderBottom: activeTab === 'reviews' ? '2px solid #FF5520' : 'none' }}
          >
            Customer Reviews ({cook.reviewsCount})
          </button>
        </div>

        {/* Tab 1: Menu Items */}
        {activeTab === 'menu' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {cook.menu.map(item => {
              const qty = quantities[item.id] || 0;
              return (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: item.isThali ? '#FFF8F5' : '#FAF8F5',
                    border: item.isThali ? '1.5px solid #FFD0C2' : '1px solid #EBE5DB',
                    gap: '16px'
                  }}
                >
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.82rem' }}>🟢</span>
                      <strong style={{ fontSize: '0.98rem', color: '#0F172A' }}>{item.name}</strong>
                      {item.isPopular && (
                        <span className="badge-tag badge-primary" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                          Customer Favorite
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.4 }}>
                      {item.desc}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', minWidth: '55px', textAlign: 'right' }}>
                      ₹{item.price}
                    </div>

                    {qty > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FF5520', borderRadius: '9999px', padding: '4px 8px', color: '#ffffff' }}>
                        <button onClick={() => handleDecrement(item.id)} style={{ color: 'white' }}>
                          <Minus size={14} />
                        </button>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', minWidth: '16px', textAlign: 'center' }}>
                          {qty}
                        </span>
                        <button onClick={() => handleIncrement(item.id)} style={{ color: 'white' }}>
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: '9999px', borderColor: '#FF5520', color: '#FF5520' }}
                        onClick={() => handleIncrement(item.id)}
                      >
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Hygiene Checklist */}
        {activeTab === 'hygiene' && (
          <div style={{ padding: '8px 0' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '12px', color: '#0F172A' }}>
              Kitchen Hygiene Protocols Verified by TiffinMatch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cook.hygieneChecklist.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#334155' }}>
                  <CheckCircle2 size={18} color="#10B981" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {cook.reviews.map((rev, index) => (
              <div key={index} style={{ padding: '12px 16px', background: '#FAF8F5', borderRadius: 'var(--radius-sm)', border: '1px solid #EBE5DB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{rev.user} ({rev.role})</span>
                  <span style={{ color: '#D97706', fontSize: '0.82rem' }}>{'★'.repeat(rev.rating)}</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#475569' }}>"{rev.comment}"</p>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{rev.date}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Action Footer */}
        <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
              {totalSelectedItems > 0 ? `${totalSelectedItems} items selected` : 'Select items to create your tiffin'}
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
              {totalAmount > 0 ? `Total: ₹${totalAmount}` : 'Custom Tiffin'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Quick 1-click Order Full Tiffin Thali */}
            <button 
              className="btn-secondary"
              onClick={() => {
                const thali = cook.menu.find(m => m.isThali) || cook.menu[0];
                onAddToCart(thali, cook, 1);
                onClose();
              }}
            >
              Order Full Tiffin (₹100)
            </button>

            <button 
              className="btn-primary"
              disabled={totalSelectedItems === 0}
              style={{ opacity: totalSelectedItems === 0 ? 0.6 : 1 }}
              onClick={handleAddItemsToCart}
            >
              <ShoppingBag size={16} />
              Add to Tiffin Box
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
