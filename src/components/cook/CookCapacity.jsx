import React, { useState, useEffect } from 'react';
import { Flame, Power, Plus, Trash2, Edit3, MapPin, Navigation } from 'lucide-react';

export default function CookCapacity({ user, orders }) {
  const [kitchenOpen, setKitchenOpen] = useState(true);
  const [dailyCapacity, setDailyCapacity] = useState(30);
  
  // Real active orders count
  const myOrders = orders.filter(o => o.cook === user?.name);
  const bookedMeals = myOrders.filter(o => o.status !== 'Delivered').length;

  const availableMeals = Math.max(0, dailyCapacity - bookedMeals);
  const capacityPercent = Math.min(100, Math.round((bookedMeals / dailyCapacity) * 100));

  // Menu Management State
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Homestyle Dal Tadka", price: 40, category: "Mains" },
    { id: 2, name: "Steamed Jeera Basmati Rice", price: 30, category: "Breads & Rice" },
    { id: 3, name: "Full Tiffin Thali", price: 100, category: "Combo Thali" }
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Mains');

  // Kitchen Location State
  const [liveLocation, setLiveLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = [position.coords.latitude, position.coords.longitude];
          setLiveLocation(loc);
          // Sync with real backend for cross-device support (Setting fixed location)
          if (user?.uniqueId) {
            fetch('http://localhost:3001/api/cooks/location', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ uniqueId: user.uniqueId, lat: loc[0], lng: loc[1] })
            }).catch(e => console.error('Failed to sync location:', e));
          }
          setIsLocating(false);
        },
        (error) => {
          console.error("GPS Error:", error);
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
    }
  }, [user]);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    const newItem = {
      id: Date.now(),
      name: newItemName,
      price: parseInt(newItemPrice),
      category: newItemCategory
    };
    setMenuItems([...menuItems, newItem]);
    setNewItemName('');
    setNewItemPrice('');
  };

  const handleRemoveItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

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
      
      {/* Fixed Kitchen Location Strip */}
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-sm)', padding: '12px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#475569', borderRadius: '50%', padding: '8px' }}>
            <MapPin size={18} color="#ffffff" />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1E293B' }}>Registered Kitchen Location</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
              Your kitchen's fixed location. Customers within 20km can match with you.
            </p>
          </div>
        </div>
        <div style={{ background: '#ffffff', padding: '8px 16px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #CBD5E1' }}>
          <Navigation size={16} color="#64748B" />
          {isLocating ? 'Acquiring Location...' : liveLocation ? `${liveLocation[0].toFixed(4)}, ${liveLocation[1].toFixed(4)}` : 'Location Offline'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Capacity Section */}
        <div className="capacity-controller-box" style={{ width: '100%' }}>
          <div className="capacity-status-row">
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={20} color="#FF5520" />
                Daily Meals Limit
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748B' }}>
                Set the maximum number of meals you want to cook today.
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-display)' }}>
                {availableMeals}
              </span>
              <span style={{ color: '#64748B', fontSize: '0.9rem' }}> left to cook</span>
            </div>
          </div>

          <div className="capacity-meter-bar">
            <div 
              className="capacity-meter-fill"
              style={{ width: `${capacityPercent}%` }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748B', marginBottom: '20px' }}>
            <span>{bookedMeals} meals ordered</span>
            <span>{availableMeals} meals available</span>
          </div>

          <div style={{ background: '#FAF8F5', padding: '16px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid #EBE5DB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1E293B' }}>
                Set Today's Limit:
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
              <span>15 (Light)</span>
              <span>30 (Medium)</span>
              <span>60 (Busy)</span>
            </div>
          </div>
        </div>

        {/* Menu Management Section */}
        <div className="capacity-controller-box" style={{ width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Edit3 size={20} color="#4F46E5" />
            Menu Management
          </h3>
        
        {/* Add New Item Form */}
        <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Item Name (e.g. Paneer Butter Masala)" 
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="filter-input"
            style={{ flex: '2', minWidth: '200px' }}
          />
          <input 
            type="number" 
            placeholder="Price (₹)" 
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            className="filter-input"
            style={{ flex: '1', minWidth: '100px' }}
          />
          <select 
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="filter-select"
            style={{ flex: '1', minWidth: '120px' }}
          >
            <option value="Mains">Mains</option>
            <option value="Breads & Rice">Breads & Rice</option>
            <option value="Combo Thali">Combo Thali</option>
            <option value="Dessert">Dessert</option>
            <option value="Sides">Sides</option>
          </select>
          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Add Item
          </button>
        </form>

        {/* Current Menu List */}
        <div style={{ border: '1px solid #E2E8F0', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          {menuItems.map((item, index) => (
            <div 
              key={item.id} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '12px 16px',
                background: index % 2 === 0 ? '#ffffff' : '#F8FAFC',
                borderBottom: index !== menuItems.length - 1 ? '1px solid #E2E8F0' : 'none'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.95rem' }}>{item.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>{item.category}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <strong style={{ color: '#059669' }}>₹{item.price}</strong>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                  title="Remove Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {menuItems.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '0.9rem' }}>
              Your menu is empty. Add some delicious items above!
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
