import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ChefHat, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Award,
  HeartHandshake,
  DollarSign
} from 'lucide-react';
import { PLATFORM_STATS } from '../data/mockData';

export default function LandingPage({ setCurrentView, onOpenAuthModal }) {
  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section className="landing-hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-badge">
              <Sparkles size={16} />
              AI-Powered Hyperlocal Food Matching
            </div>

            <h1 className="hero-title">
              Home-Cooked Food.<br />
              <span className="gradient-text">Matched Smarter.</span>
            </h1>

            <p className="hero-subtitle">
              AI-powered matching that connects you with trusted home cooks nearby — while helping local kitchens turn unused capacity into income.
            </p>

            <div className="hero-cta-group">
              <button 
                className="btn-primary"
                onClick={() => setCurrentView('dashboard')}
              >
                Find Home Food
                <ArrowRight size={18} />
              </button>

              <button 
                className="btn-secondary"
                onClick={() => onOpenAuthModal('cook')}
              >
                <ChefHat size={18} color="#FF5520" />
                Become a Home Cook (Partner ID)
              </button>
            </div>

            {/* Visual Matching Flow: Customer Demand -> AI -> Match -> Cook -> Meal */}
            <div className="hero-flow-container">
              <div className="flow-title">
                <Sparkles size={14} color="#6366F1" />
                How the Matching Engine Connects Demand to Capacity
              </div>
              <div className="flow-nodes-wrapper">
                <div className="flow-node">
                  <span>🍱</span>
                  <span>Customer Demand</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-node highlight-ai">
                  <span>🤖</span>
                  <span>AI Demand Prediction</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-node highlight-ai">
                  <span>⚡</span>
                  <span>Smart Matching</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-node highlight-cook">
                  <span>👩‍🍳</span>
                  <span>Nearby Home Cook</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-node" style={{ background: '#ECFDF5', borderColor: '#A7F3D0', color: '#047857' }}>
                  <span>🍛</span>
                  <span>Fresh Meal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card with live floating badges */}
          <div className="hero-visual-card">
            <div className="hero-main-img-wrapper">
              <img 
                src="/images/hero_thali.jpg" 
                alt="Fresh authentic Indian homestyle meal thali" 
                className="hero-main-img"
              />
            </div>

            {/* Floating Live Badge 1 */}
            <div className="hero-floating-badge-1">
              <div style={{ background: '#ECFDF5', borderRadius: '50%', padding: '8px', color: '#10B981' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                  Verified Hygiene Profile
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  FSSAI & RO Water Inspected
                </div>
              </div>
            </div>

            {/* Floating Live Badge 2 */}
            <div className="hero-floating-badge-2">
              <div style={{ background: '#FFF3EB', borderRadius: '50%', padding: '8px', color: '#FF5520' }}>
                <Clock size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                  Maa Ki Rasoi (1.2 km away)
                </div>
                <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
                  ● 18 / 30 meals capacity available
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS (4 STEPS) ================= */}
      <section className="section-how-it-works">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Seamless & Transparent</div>
            <h2 className="section-title">How TiffinMatch Works</h2>
            <p className="section-subtitle">
              Intelligent capacity allocation means fresher meals for customers and guaranteed sales for home cooks without food waste.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon-box">🍱</div>
              <h3 className="step-title">Choose Your Meal</h3>
              <p className="step-desc">
                Tell us your taste, diet preferences (Veg, Jain, Protein), budget, and desired lunch or dinner delivery slot.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon-box" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>🤖</div>
              <h3 className="step-title">AI Finds the Best Match</h3>
              <p className="step-desc">
                Our algorithm scans nearby home kitchens with active stove capacity, matching you with the closest verified cook.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon-box" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>👩‍🍳</div>
              <h3 className="step-title">Local Cook Prepares It</h3>
              <p className="step-desc">
                Your neighborhood cook prepares fresh, homestyle batches using cold-pressed oils and clean RO water.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon-box" style={{ background: '#ECFDF5', borderColor: '#A7F3D0' }}>✨</div>
              <h3 className="step-title">Enjoy Fresh Home Food</h3>
              <p className="step-desc">
                Hot, comforting meals delivered right to your PG, office desk, or flat in hygienic, food-grade packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY TIFFINMATCH? (6 PILLARS) ================= */}
      <section className="section-why-us">
        <div className="container">
          <div className="section-header">
            <div className="section-label">The Platform Advantage</div>
            <h2 className="section-title">Why Choose TiffinMatch?</h2>
            <p className="section-subtitle">
              We replace mass-produced commercial restaurant grease with wholesome, loving homestyle cooking.
            </p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon-box">🏠</div>
              <h3 className="why-card-title">Authentic Home-Cooked Food</h3>
              <p className="why-card-desc">
                Prepared by experienced homemakers using authentic family recipes, fresh chakki atta, and zero artificial preservatives.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon-box" style={{ background: '#EFF6FF' }}>🤖</div>
              <h3 className="why-card-title">AI-Powered Matching</h3>
              <p className="why-card-desc">
                Predictive algorithms forecast neighborhood hunger patterns and route orders to kitchens with exact spare capacity.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon-box" style={{ background: '#FEF3C7' }}>📍</div>
              <h3 className="why-card-title">Nearby Local Cooks</h3>
              <p className="why-card-desc">
                Sourced from within a 1.5–3.5 km radius. Less transit time means your phulkas stay soft and dal stays steaming hot.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon-box" style={{ background: '#ECFDF5' }}>🧼</div>
              <h3 className="why-card-title">Verified Hygiene Profiles</h3>
              <p className="why-card-desc">
                Strict multi-point kitchen audits, mandatory RO water tests, clean workspace video verification, and FSSAI tracking.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon-box" style={{ background: '#F5F3FF' }}>💰</div>
              <h3 className="why-card-title">Affordable Pricing</h3>
              <p className="why-card-desc">
                Healthy daily meals starting at just ₹80–₹100. Perfect for students, hostelers, and working professionals on a budget.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon-box" style={{ background: '#FFF1F2' }}>👩‍🍳</div>
              <h3 className="why-card-title">Support Local Home Cooks</h3>
              <p className="why-card-desc">
                Empower neighborhood women and home chefs to build flexible, dignified financial independence right from their kitchens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SOCIAL IMPACT SECTION ================= */}
      <section className="container">
        <div className="section-social-impact">
          <div className="container impact-grid">
            <div>
              <div className="impact-badge">
                <HeartHandshake size={16} />
                Economic & Social Impact
              </div>
              <h2 className="impact-title">
                Turn Kitchen Capacity Into Opportunity.
              </h2>
              <p className="impact-desc">
                Millions of home kitchens already prepare daily meals for their own families and have unused burner capacity. TiffinMatch bridges the gap: helping homemakers monetize that spare stove space without requiring commercial loans, staff, or high-risk storefront overheads.
              </p>
              <button 
                className="btn-primary"
                style={{ background: '#ffffff', color: '#0F172A', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}
                onClick={() => onOpenAuthModal('cook')}
              >
                Join as a Partner Home Cook (Partner ID)
                <ArrowRight size={18} color="#FF5520" />
              </button>
            </div>

            {/* Prototype statistics */}
            <div className="stats-counter-grid">
              <div className="stat-box">
                <div className="stat-number">{PLATFORM_STATS.activeCooks}+</div>
                <div className="stat-label">Verified Home Cooks</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{PLATFORM_STATS.mealsDelivered.toLocaleString()}+</div>
                <div className="stat-label">Wholesome Meals Served</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{PLATFORM_STATS.capacityUtilized}%</div>
                <div className="stat-label">Kitchen Capacity Utilized</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{PLATFORM_STATS.avgRating} / 5 ⭐</div>
                <div className="stat-label">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
