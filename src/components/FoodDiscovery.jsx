import React, { useState } from 'react';
import { 
  Search, 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle, 
  SlidersHorizontal, 
  Sparkles,
  Flame,
  ArrowUpDown
} from 'lucide-react';
import { HOME_COOKS, CATEGORIES } from '../data/mockData';

// Utility function to calculate distance in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export default function FoodDiscovery({ onSelectCook, setCurrentView }) {
  const [userLocation, setUserLocation] = useState([12.9352, 77.6245]); // Default

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const [dietFilter, setDietFilter] = useState('all');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [maxPrice, setMaxPrice] = useState(150);
  const [maxDistance, setMaxDistance] = useState(20.0);
  const [minRating, setMinRating] = useState(4.5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');

  const processedCooks = HOME_COOKS.map(cook => ({
    ...cook,
    realDistance: getDistanceFromLatLonInKm(userLocation[0], userLocation[1], cook.lat, cook.lng)
  }));

  const isAnyCookWithin20Km = processedCooks.some(c => c.realDistance <= 20);

  const filteredCooks = processedCooks.filter(cook => {
    // Hard cutoff if totally out of range
    if (cook.realDistance > 20) return false;

    // Diet filter
    if (dietFilter === 'pure-jain' && cook.dietType !== 'pure-jain') return false;
    
    // Cuisine filter
    if (cuisineFilter !== 'all' && !cook.cuisine.toLowerCase().includes(cuisineFilter.toLowerCase())) {
      return false;
    }

    // Distance filter (UI slider)
    if (cook.realDistance > maxDistance) return false;

    // Rating filter
    if (cook.rating < minRating) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = cook.name.toLowerCase().includes(q) ||
                    cook.cuisine.toLowerCase().includes(q) ||
                    cook.locality.toLowerCase().includes(q) ||
                    cook.menu.some(m => m.name.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'distance') return a.realDistance - b.realDistance;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'capacity') return b.availableCapacity - a.availableCapacity;
    return 0; // recommended default
  });

  return (
    <div className="container" style={{ padding: '36px 24px 64px' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '28px' }}>
        <div className="badge-tag badge-primary" style={{ marginBottom: '8px' }}>
          <Flame size={14} />
          Hyperlocal Kitchen Discovery
        </div>
        <h1 style={{ fontSize: '2.2rem', color: '#0F172A', marginBottom: '6px' }}>
          Fresh Home-Cooked Food Near You
        </h1>
        <p style={{ color: '#64748B', fontSize: '1rem' }}>
          Discover verified home kitchens in your neighborhood with real-time meal capacity.
        </p>
      </div>

      {/* Category Pills */}
      <div className="category-filter-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(cat.id);
              if (cat.id === 'north-indian') setCuisineFilter('North Indian');
              else if (cat.id === 'regional') setCuisineFilter('all');
              else setCuisineFilter('all');
            }}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Comprehensive Filter Panel */}
      <div className="filter-panel">
        <div className="filter-row">
          {/* Search Box */}
          <div className="filter-item" style={{ flexGrow: 1, minWidth: '220px' }}>
            <label className="filter-label">Search Kitchen or Dish</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="E.g. Maa Ki Rasoi, Dal Tadka, Phulkas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-input"
                style={{ paddingLeft: '34px', width: '100%' }}
              />
            </div>
          </div>

          {/* Diet Filter */}
          <div className="filter-item">
            <label className="filter-label">Dietary Preference</label>
            <select 
              value={dietFilter} 
              onChange={(e) => setDietFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Diets</option>
              <option value="veg">Pure Vegetarian</option>
              <option value="pure-jain">Jain Friendly (No Onion/Garlic)</option>
            </select>
          </div>

          {/* Cuisine Filter */}
          <div className="filter-item">
            <label className="filter-label">Cuisine Type</label>
            <select 
              value={cuisineFilter} 
              onChange={(e) => setCuisineFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Cuisines</option>
              <option value="North Indian">North Indian Homestyle</option>
              <option value="Punjabi">Punjabi & Parathas</option>
              <option value="Gujarati">Gujarati & Kathiyawadi</option>
              <option value="South Indian">South Indian Tiffin</option>
              <option value="Maharashtrian">Maharashtrian</option>
            </select>
          </div>

          {/* Max Distance Slider */}
          <div className="filter-item">
            <label className="filter-label">Max Distance: {maxDistance} km</label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              step="1"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
              style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>

          {/* Sort By */}
          <div className="filter-item">
            <label className="filter-label">Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="recommended">AI Recommended</option>
              <option value="distance">Closest First (Distance)</option>
              <option value="rating">Highest Rating</option>
              <option value="capacity">Most Capacity Available</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.92rem', color: '#475569', fontWeight: 600 }}>
          Showing <strong>{filteredCooks.length}</strong> home cooks available now
        </div>

        <button 
          className="btn-ai-glow" 
          style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          onClick={() => setCurrentView('ai-match')}
        >
          <Sparkles size={15} />
          Launch AI Matchmaker
        </button>
      </div>

      {/* Cooks Grid */}
      {!isAnyCookWithin20Km ? (
        <div 
          style={{ 
            background: '#F8FAFC', 
            borderRadius: 'var(--radius-lg)', 
            padding: '64px 24px', 
            textAlign: 'center',
            border: '1px solid #E2E8F0',
            marginTop: '20px'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📍</div>
          <h3 style={{ fontSize: '1.6rem', color: '#0F172A', marginBottom: '12px' }}>Service Not Available Here</h3>
          <p style={{ color: '#64748B', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
            We currently don't have any verified home kitchens within a 20km radius of your location. But don't worry, we are expanding quickly and coming to your area soon!
          </p>
        </div>
      ) : filteredCooks.length === 0 ? (
        <div 
          style={{ 
            background: '#ffffff', 
            borderRadius: 'var(--radius-lg)', 
            padding: '48px 24px', 
            textAlign: 'center',
            border: '1px dashed #CBD5E1' 
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No home cooks matched this filter</h3>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '20px' }}>
            Try increasing the distance slider or selecting "All Diets".
          </p>
          <button 
            className="btn-secondary"
            onClick={() => {
              setDietFilter('all');
              setCuisineFilter('all');
              setMaxDistance(4.0);
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
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
                  <span>📍 {cook.realDistance.toFixed(1)} km</span>
                  <span>•</span>
                  <span>{cook.locality}</span>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <span className="badge-tag" style={{ background: '#F1F5F9', color: '#475569' }}>
                    {cook.cuisine}
                  </span>
                  <span className="badge-tag" style={{ background: '#F1F5F9', color: '#475569' }}>
                    ⏱️ {cook.prepTimeMins}
                  </span>
                </div>

                <p className="cook-tagline">
                  "{cook.tagline}"
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <span className="badge-tag badge-emerald">
                    <CheckCircle size={12} />
                    ✓ Hygiene Profile Verified
                  </span>
                </div>

                <div className="cook-meta-footer">
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>PRICE RANGE</div>
                    <div className="price-range-label">{cook.priceRange}</div>
                  </div>

                  <button 
                    className="btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.86rem' }}
                    onClick={() => onSelectCook(cook)}
                  >
                    View Menu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
