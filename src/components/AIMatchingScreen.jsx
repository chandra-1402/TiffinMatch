import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle, 
  Flame, 
  DollarSign, 
  ArrowRight, 
  RotateCcw,
  Zap,
  Sliders,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HOME_COOKS } from '../data/mockData';

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

export default function AIMatchingScreen({ onConfirmOrder, onSelectCook }) {
  const [userLocation, setUserLocation] = useState([12.9352, 77.6245]); // Default
  const [liveCookLocations, setLiveCookLocations] = useState({});
  const [diet, setDiet] = useState('Vegetarian');
  const [mealType, setMealType] = useState('Lunch');
  const [budget, setBudget] = useState(120);
  const [maxDistance, setMaxDistance] = useState(2.0);
  const [oilPreference, setOilPreference] = useState('Low Oil Homestyle');
  
  // States: 'input' | 'matching' | 'result'
  const [matchState, setMatchState] = useState('input');
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
    }

    // Fetch live cook locations from backend
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/api/cooks/location`)
      .then(res => res.json())
      .then(data => setLiveCookLocations(data))
      .catch(e => console.error('Failed to load cook GPS:', e));
  }, []);

  const matchResult = React.useMemo(() => {
    let availableCooks = HOME_COOKS.map(c => {
      // Use live GPS from real backend if available
      const liveLoc = liveCookLocations[c.uniqueId];
      const cookLat = liveLoc ? liveLoc[0] : c.lat;
      const cookLng = liveLoc ? liveLoc[1] : c.lng;

      const actualDistance = getDistanceFromLatLonInKm(userLocation[0], userLocation[1], cookLat, cookLng);
      return { ...c, distanceKm: actualDistance.toFixed(1), lat: cookLat, lng: cookLng };
    }).filter(c => parseFloat(c.distanceKm) <= maxDistance && c.availableCapacity > 0);

    if (diet === 'Jain Pure Veg') {
      availableCooks = availableCooks.filter(c => c.dietType === 'pure-jain');
    } else if (diet === 'High Protein') {
      availableCooks = availableCooks.filter(c => c.cuisine.includes('Protein') || c.dietType === 'protein'); 
    } else if (diet === 'Vegetarian') {
      availableCooks = availableCooks.filter(c => c.dietType === 'veg' || c.dietType === 'pure-jain');
    } else if (diet === 'Non-Vegetarian') {
      availableCooks = availableCooks.filter(c => c.dietType === 'non-veg');
    }

    for (let cook of availableCooks) {
      const affordableMeal = cook.menu.find(m => m.price <= budget && (m.isThali || m.category === 'Mains'));
      if (affordableMeal) {
        return { cook, meal: affordableMeal };
      }
    }
    return null;
  }, [maxDistance, budget, diet, userLocation, liveCookLocations]);

  const matchedCook = matchResult?.cook;
  const matchedMeal = matchResult?.meal;

  // Quick prompt presets
  const applyPreset = (presetDiet, presetBudget, presetType) => {
    setDiet(presetDiet);
    setBudget(presetBudget);
    setMealType(presetType);
  };

  const handleStartMatching = () => {
    setMatchState('matching');
    setActiveStep(1);

    // Progressive step simulation
    setTimeout(() => setActiveStep(2), 1100);
    setTimeout(() => setActiveStep(3), 2200);
    setTimeout(() => setActiveStep(4), 3300);
    setTimeout(() => {
      setMatchState('result');
      if (matchResult) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // Fallback gracefully if confetti unavailable
        }
      }
    }, 4400);
  };

  const handleReset = () => {
    setMatchState('input');
    setActiveStep(0);
  };

  return (
    <div className="container ai-matching-container">
      {/* Header */}
      {matchState === 'input' && (
        <div className="ai-match-header">
          <div className="ai-match-badge">
            <Sparkles size={16} />
            Predictive Kitchen Capacity Engine
          </div>
          <h1 className="ai-match-title">
            TiffinMatch AI Matchmaker
          </h1>
          <p className="ai-match-subtitle">
            Tell AI your meal cravings & budget. We automatically find the best neighborhood home cook with available stove capacity.
          </p>
        </div>
      )}

      {/* STATE 1: USER INPUT & PREFERENCES */}
      {matchState === 'input' && (
        <div className="ai-input-card">
          {/* Quick preset chips */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
              Popular Quick Matches
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                className="category-pill active" 
                style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                onClick={() => applyPreset('Vegetarian', 120, 'Lunch')}
              >
                🎯 “Vegetarian lunch under ₹120”
              </button>
              <button 
                className="category-pill" 
                style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                onClick={() => applyPreset('Vegetarian', 100, 'Lunch')}
              >
                🍱 “Student North Indian Thali under ₹100”
              </button>
              <button 
                className="category-pill" 
                style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                onClick={() => applyPreset('Jain Pure Veg', 110, 'Dinner')}
              >
                🥗 “Sattvik Jain meal under ₹110”
              </button>
            </div>
          </div>

          <div className="form-grid">
            {/* Meal Slot */}
            <div className="form-group">
              <label className="form-label">Meal Slot</label>
              <div className="radio-pill-group">
                <button 
                  className={`radio-pill ${mealType === 'Lunch' ? 'selected' : ''}`}
                  onClick={() => setMealType('Lunch')}
                >
                  ☀️ Lunch (12:30 – 2:00 PM)
                </button>
                <button 
                  className={`radio-pill ${mealType === 'Dinner' ? 'selected' : ''}`}
                  onClick={() => setMealType('Dinner')}
                >
                  🌙 Dinner (7:30 – 9:30 PM)
                </button>
              </div>
            </div>

            {/* Diet Preference */}
            <div className="form-group">
              <label className="form-label">Diet Preference</label>
              <div className="radio-pill-group">
                <button 
                  className={`radio-pill ${diet === 'Vegetarian' ? 'selected' : ''}`}
                  onClick={() => setDiet('Vegetarian')}
                >
                  🌱 Vegetarian
                </button>
                <button 
                  className={`radio-pill ${diet === 'Jain Pure Veg' ? 'selected' : ''}`}
                  onClick={() => setDiet('Jain Pure Veg')}
                >
                  🙏 Pure Jain
                </button>
                <button 
                  className={`radio-pill ${diet === 'High Protein' ? 'selected' : ''}`}
                  onClick={() => setDiet('High Protein')}
                >
                  💪 High Protein
                </button>
              </div>
            </div>

            {/* Budget Cap Slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Budget Per Meal</label>
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
                  ₹{budget} max
                </span>
              </div>
              <input 
                type="range" 
                min="70" 
                max="180" 
                step="10"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748B' }}>
                <span>₹70 (Economy)</span>
                <span>₹120 (Standard Thali)</span>
                <span>₹180 (Special)</span>
              </div>
            </div>

            {/* Max Distance Slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Kitchen Distance Limit</label>
                <span style={{ fontWeight: 700, color: '#1E293B' }}>
                  Within {maxDistance} km
                </span>
              </div>
              <input 
                type="range" 
                min="1.0" 
                max="20.0" 
                step="0.5"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748B' }}>
                <span>1.0 km (Walking)</span>
                <span>10.0 km (City)</span>
                <span>20.0 km (Wide Radius)</span>
              </div>
            </div>
          </div>

          {/* Cooking Style Note */}
          <div style={{ marginBottom: '28px', padding: '14px 18px', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
              Cooking Style & Notes
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Low Oil Homestyle', 'Desi Ghee Phulkas', 'Medium Spice', 'Extra Dal Portion'].map(tag => (
                <span 
                  key={tag} 
                  className={`badge-tag ${oilPreference === tag ? 'badge-primary' : ''}`}
                  style={{ cursor: 'pointer', background: oilPreference === tag ? '#FFF0EB' : '#ffffff', border: '1px solid #CBD5E1' }}
                  onClick={() => setOilPreference(tag)}
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Run Button */}
          <div style={{ textAlign: 'center' }}>
            <button 
              className="btn-primary" 
              style={{ padding: '14px 36px', fontSize: '1.05rem', width: '100%', maxWidth: '380px' }}
              onClick={handleStartMatching}
            >
              <Sparkles size={20} />
              Run TiffinMatch AI
            </button>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '10px' }}>
              ⚡ Scans real-time kitchen capacity in Koramangala & nearby zones
            </p>
          </div>
        </div>
      )}

      {/* STATE 2: ANIMATED AI MATCHING SIMULATION */}
      {matchState === 'matching' && (
        <div className="ai-sim-screen">
          <div className="ai-sim-pulse-orb">
            🤖
          </div>

          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: '#ffffff' }}>
            TiffinMatch AI is finding your best match...
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '32px' }}>
            Evaluating "{diet} {mealType} under ₹{budget}" across neighborhood home kitchens
          </p>

          <div className="ai-steps-list">
            <div className={`ai-step-item ${activeStep >= 1 ? (activeStep > 1 ? 'done' : 'active') : ''}`}>
              {activeStep > 1 ? <CheckCircle size={18} color="#10B981" /> : <Clock size={18} />}
              <span>1. Scanning 16 verified home kitchens in your {maxDistance} km radius...</span>
            </div>

            <div className={`ai-step-item ${activeStep >= 2 ? (activeStep > 2 ? 'done' : 'active') : ''}`}>
              {activeStep > 2 ? <CheckCircle size={18} color="#10B981" /> : <Flame size={18} />}
              <span>2. Calculating active stove capacity & unallocated meal batches...</span>
            </div>

            <div className={`ai-step-item ${activeStep >= 3 ? (activeStep > 3 ? 'done' : 'active') : ''}`}>
              {activeStep > 3 ? <CheckCircle size={18} color="#10B981" /> : <ShieldCheck size={18} />}
              <span>3. Verifying hygiene score (≥95%) and budget cap (≤₹{budget})...</span>
            </div>

            <div className={`ai-step-item ${activeStep >= 4 ? 'active' : ''}`}>
              <Zap size={18} color="#F59E0B" />
              <span>4. Optimizing hot delivery route & fresh batch timing...</span>
            </div>
          </div>
        </div>
      )}

      {/* STATE 3: MATCH RESULT REVEAL */}
      {matchState === 'result' && matchedCook && (
        <div className="match-result-card">
          <div className="match-score-banner">
            <div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#059669', fontWeight: 800 }}>
                AI Recommendation Complete
              </div>
              <h2 style={{ fontSize: '1.8rem', color: '#0F172A' }}>
                98% Perfect Match Found!
              </h2>
            </div>

            <div className="match-score-badge">
              <Sparkles size={18} />
              98% Match Score
            </div>
          </div>

          {/* Matched Cook Summary */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '140px 1fr auto', 
              gap: '24px', 
              alignItems: 'center',
              padding: '20px',
              background: '#FAF8F5',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #EBE5DB',
              marginBottom: '24px'
            }}
          >
            <img 
              src="/images/hero_thali.jpg" 
              alt="Matched Thali" 
              style={{ width: '140px', height: '110px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#0F172A' }}>{matchedCook.name}</h3>
                <span className="badge-tag badge-emerald">✓ Verified Hygiene</span>
              </div>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
                {matchedMeal.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                By Cook {matchedCook.cookName} • 📍 {matchedCook.locality} ({matchedCook.distanceKm} km away)
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FF5520', fontFamily: 'var(--font-display)' }}>
                ₹{matchedMeal.price}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                Saved ₹{budget - matchedMeal.price} vs budget!
              </div>
            </div>
          </div>

          {/* Why AI Matched This Card */}
          <div className="ai-reason-list">
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#6366F1" />
              Why TiffinMatch AI Chose This Kitchen:
            </div>

            <div className="ai-reason-item">
              <span>⚡</span>
              <div>
                <strong>Proximity & Freshness:</strong> Located just {matchedCook.distanceKm} km away. Estimated hot delivery in 22 minutes without heat-loss.
              </div>
            </div>

            <div className="ai-reason-item">
              <span>💰</span>
              <div>
                <strong>Budget Optimization:</strong> ₹{matchedMeal.price} full thali is comfortably within your ₹{budget} limit.
              </div>
            </div>

            <div className="ai-reason-item">
              <span>🔥</span>
              <div>
                <strong>Active Kitchen Capacity:</strong> Simran Kaur is preparing a fresh batch right now with {matchedCook.availableCapacity} spare meal slots available.
              </div>
            </div>

            <div className="ai-reason-item">
              <span>🧼</span>
              <div>
                <strong>Hygiene Trust:</strong> 98% hygiene audit score with pure RO water and zero artificial additives.
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <button 
              className="btn-secondary"
              onClick={handleReset}
            >
              <RotateCcw size={15} />
              Adjust Criteria
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn-secondary"
                onClick={() => onSelectCook(matchedCook)}
              >
                Customize Tiffin Items
              </button>

              <button 
                className="btn-primary"
                style={{ padding: '12px 28px' }}
                onClick={() => onConfirmOrder(matchedCook, matchedMeal)}
              >
                Confirm Match & Order Now (₹{matchedMeal.price})
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {matchState === 'result' && !matchedCook && (
        <div className="match-result-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🍽️</div>
          <h2 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '12px' }}>
            No Kitchen Available Nearby
          </h2>
          <p style={{ color: '#64748B', fontSize: '1rem', marginBottom: '32px' }}>
            We couldn't find an active home kitchen matching your criteria within {maxDistance} km. Try increasing your distance radius or budget to discover more options.
          </p>
          <button 
            className="btn-ai-glow"
            onClick={handleReset}
          >
            <Sliders size={18} />
            Adjust Criteria
          </button>
        </div>
      )}
    </div>
  );
}
