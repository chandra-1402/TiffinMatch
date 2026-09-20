import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Star, 
  Flame, 
  ArrowRight, 
  Search, 
  SlidersHorizontal,
  CheckCircle,
  Package,
  CalendarCheck,
  Navigation
} from 'lucide-react';
import { CATEGORIES, HOME_COOKS } from '../data/mockData';
import KitchenMap from './KitchenMap';

export default function CustomerDashboard({ 
  user, 
  setCurrentView, 
  onSelectCook, 
  onQuickOrderThali,
  orders,
  onTrackOrder 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addressInput, setAddressInput] = useState(user.location || '');
  const [userLocation, setUserLocation] = useState([12.9352, 77.6245]); // Default Koramangala

  const handleUpdateLocation = () => {
    // Basic mock geocoding logic for demonstration
    const addr = addressInput.toLowerCase();
    if (addr.includes('hsr')) setUserLocation([12.9121, 77.6446]);
    else if (addr.includes('btm')) setUserLocation([12.9166, 77.6101]);
    else if (addr.includes('jayanagar')) setUserLocation([12.9299, 77.5826]);
    else if (addr.includes('indiranagar')) setUserLocation([12.9784, 77.6408]);
    else setUserLocation([12.9352, 77.6245]); // default
  };

  // Filter cooks based on category and search
  const filteredCooks = HOME_COOKS.filter(cook => {
    const matchesSearch = cook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cook.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cook.locality.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'north-indian') return matchesSearch && cook.cuisine.includes('North Indian');
    if (selectedCategory === 'healthy') return matchesSearch && (cook.dietType === 'pure-jain' || cook.tagline.includes('oils'));
    if (selectedCategory === 'regional') return matchesSearch && (cook.cuisine.includes('Gujarati') || cook.cuisine.includes('South') || cook.cuisine.includes('Maharashtrian'));
    if (selectedCategory === 'student-tiffin') return matchesSearch && cook.id === 1; // Maa Ki Rasoi student favorite
    if (selectedCategory === 'high-protein') return matchesSearch && (cook.cuisine.includes('Punjabi') || cook.name.includes('Punjabi'));
    if (selectedCategory === 'traditional') return matchesSearch;
    return matchesSearch;
  });

  // Get user orders (filter by customerId or customer name for backwards compatibility with mock data)
  const userOrders = orders.filter(
    (o) => o.customerId === user.uniqueId || o.customer.includes(user.name)
  );

  return (
    <div className="dashboard-wrapper container">
      {/* ================= GREETING HEADER ================= */}
      <div className="greeting-banner">
        <div>
          <h1 className="greeting-title">
            Good evening, {user.name} 👋
          </h1>
          <p className="greeting-subtitle">
            <MapPin size={15} style={{ display: 'inline', marginRight: '4px', color: '#FF5520' }} />
            Delivering hot to: <strong>{user.location}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            className="btn-ai-glow"
            onClick={() => setCurrentView('ai-match')}
          >
            <Sparkles size={18} />
            Let AI Match My Meal
          </button>
        </div>
      </div>

      {/* ================= DELIVERY LOCATION & MAP ================= */}
      <div style={{ marginBottom: '40px', background: '#F8FAFC', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <MapPin size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Enter your delivery address (e.g., HSR Layout, BTM, Koramangala)"
              style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: 'var(--radius-md)', border: '1px solid #CBD5E1', fontSize: '1rem', outline: 'none' }}
            />
          </div>
          <button className="btn-primary" onClick={handleUpdateLocation} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px' }}>
            <Navigation size={18} /> Find Kitchens
          </button>
        </div>
        
        <KitchenMap 
          userLocation={userLocation} 
          onSelectCook={onSelectCook}
        />
      </div>

      {/* ================= AI RECOMMENDATION CARD ================= */}
      <div className="ai-recommendation-card">
        <div className="ai-card-header">
          <div className="ai-pill-header">
            <Sparkles size={20} color="#FF5520" />
            <span>AI Recommendation</span>
          </div>
          <div className="ai-signal-text">
            ⚡ High demand for North Indian home meals near you today
          </div>
        </div>

        <div className="ai-rec-content-grid">
          <img 
            src="/images/hero_thali.jpg" 
            alt="Recommended Homestyle Thali" 
            className="ai-meal-thumb" 
          />

          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Maa Ki Rasoi • Sector 5 Kitchen
            </div>
            <h3 className="ai-meal-name">
              Dal • Rice • Roti • Seasonal Sabzi
            </h3>
            <div className="ai-meta-pills">
              <span>⭐ <strong>4.8</strong> (342 reviews)</span>
              <span>•</span>
              <span>📍 Approx. <strong>1.2 km</strong> away</span>
              <span>•</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>
                ✓ Verified Hygiene Profile
              </span>
              <span>•</span>
              <span style={{ color: '#D97706', fontWeight: 600 }}>
                🔥 18 meals available today
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <div className="ai-price-tag">₹90</div>
            <button 
              className="btn-primary"
              onClick={() => onQuickOrderThali(HOME_COOKS[0])}
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* ================= CATEGORY PILLS ================= */}
      <div className="category-filter-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* ================= QUICK SEARCH & DISCOVERY BAR ================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', color: '#0F172A' }}>
            Nearby Home Kitchens
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748B' }}>
            Showing {filteredCooks.length} verified home cooks with available capacity
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search cook, dal, sabzi, cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-input"
              style={{ paddingLeft: '36px', width: '100%' }}
            />
          </div>
          <button 
            className="btn-secondary"
            onClick={() => setCurrentView('discovery')}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <SlidersHorizontal size={15} />
            More Filters
          </button>
        </div>
      </div>

      {/* ================= HOME COOK CARDS GRID ================= */}
      <div className="cooks-grid">
        {filteredCooks.map(cook => (
          <div key={cook.id} className="cook-card">
            <div className="cook-card-image-wrap">
              <img 
                src={cook.image} 
                alt={cook.name} 
                className="cook-card-img"
              />
              <div className="capacity-overlay-badge">
                🔥 {cook.availableCapacity} / {cook.dailyCapacity} meals left
              </div>
            </div>

            <div className="cook-card-body">
              <div className="cook-header-row">
                <h3 className="cook-title">{cook.name}</h3>
                <div className="rating-badge">
                  <Star size={13} fill="#D97706" color="#D97706" />
                  {cook.rating}
                </div>
              </div>

              <div className="cook-locality-row">
                <span>📍 {cook.distanceKm} km</span>
                <span>•</span>
                <span>{cook.cuisine}</span>
              </div>

              <p className="cook-tagline">
                "{cook.tagline}"
              </p>

              <div style={{ marginBottom: '14px' }}>
                <span className="badge-tag badge-emerald">
                  <CheckCircle size={12} />
                  ✓ Hygiene Profile Verified
                </span>
              </div>

              <div className="cook-meta-footer">
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Price Range</div>
                  <div className="price-range-label">{cook.priceRange}</div>
                </div>

                <button 
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                  onClick={() => onSelectCook(cook)}
                >
                  View Menu
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= STUDENT SUBSCRIPTION MEAL PASS BANNER ================= */}
      <div 
        style={{
          marginTop: '48px',
          background: 'linear-gradient(135deg, #1E293B, #0F172A)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 32px',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#FCD34D', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '10px' }}>
            <CalendarCheck size={14} />
            STUDENT & PG SPECIAL
          </div>
          <h3 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '6px' }}>
            Student Monthly Meal Pass — Save 25%
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: '580px' }}>
            Lock in guaranteed daily lunch & dinner prepared by verified neighborhood home cooks. Zero cooking hassle, pure homestyle taste, pause anytime during exam breaks.
          </p>
        </div>

        <button 
          className="btn-primary"
          style={{ background: '#FF5520', color: '#ffffff', whiteSpace: 'nowrap' }}
          onClick={() => alert("🎉 Student Meal Pass activated! 25% discount coupon 'STUDENT25' applied to your account.")}
        >
          View 30-Day Tiffin Plans
        </button>
      </div>
    </div>
  );
}
