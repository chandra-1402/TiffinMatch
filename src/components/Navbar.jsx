import React from 'react';
import { 
  Sparkles, 
  ChefHat, 
  ShieldCheck, 
  ShoppingBag, 
  User, 
  Search, 
  Flame,
  Lock,
  LogOut,
  KeyRound,
  ShieldAlert
} from 'lucide-react';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  currentUser, 
  onOpenAuthModal, 
  onLogout,
  cartCount, 
  setIsCartOpen 
}) {
  const isCustomer = currentUser?.role === 'customer';
  const isCook = currentUser?.role === 'cook';
  const isAdmin = currentUser?.role === 'admin';
  const isGuest = !currentUser;

  return (
    <header className="navbar-wrapper">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <div 
          className="brand-logo" 
          onClick={() => setCurrentView('landing')}
          title="TiffinMatch - Go to Home"
        >
          <div className="brand-icon">
            <Flame color="#ffffff" size={22} />
          </div>
          <div>
            <div className="brand-title">
              Tiffin<span>Match</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.04em' }}>
              AI KITCHEN CAPACITY NETWORK
            </div>
          </div>
        </div>

        {/* View Switcher based on authenticated role */}
        <nav className="nav-links">
          {(isCustomer || isGuest) && (
            <>
              <button 
                className={`nav-link-btn ${currentView === 'landing' ? 'active' : ''}`}
                onClick={() => setCurrentView('landing')}
              >
                Home
              </button>
              {isCustomer && (
                <>
                  <button 
                    className={`nav-link-btn ${currentView === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setCurrentView('dashboard')}
                  >
                    Dashboard
                  </button>
                  <button 
                    className={`nav-link-btn ${currentView === 'orders' ? 'active' : ''}`}
                    onClick={() => setCurrentView('orders')}
                  >
                    Your Orders
                  </button>
                </>
              )}
              <button 
                className={`nav-link-btn ${currentView === 'discovery' ? 'active' : ''}`}
                onClick={() => setCurrentView('discovery')}
              >
                Find Food
              </button>
              <button 
                className={`nav-link-btn ${currentView === 'ai-match' ? 'active' : ''}`}
                onClick={() => setCurrentView('ai-match')}
                style={{ 
                  background: currentView === 'ai-match' ? '#EEF2FF' : 'transparent',
                  color: '#4F46E5',
                  fontWeight: 700
                }}
              >
                <Sparkles size={16} />
                AI Matchmaker
              </button>
            </>
          )}

          {isCook && (
            <>
              <button 
                className={`nav-link-btn ${currentView === 'cook-home' ? 'active' : ''}`}
                onClick={() => setCurrentView('cook-home')}
              >
                <Sparkles size={16} color="#D97706" />
                Home
              </button>
              <button 
                className={`nav-link-btn ${currentView === 'cook-capacity' ? 'active' : ''}`}
                onClick={() => setCurrentView('cook-capacity')}
              >
                Dashboard
              </button>
              <button 
                className={`nav-link-btn ${currentView === 'cook-orders' ? 'active' : ''}`}
                onClick={() => setCurrentView('cook-orders')}
              >
                Live Orders
              </button>
              <button 
                className={`nav-link-btn ${currentView === 'cook-earnings' ? 'active' : ''}`}
                onClick={() => setCurrentView('cook-earnings')}
              >
                Earnings
              </button>
              <button 
                className={`nav-link-btn ${currentView === 'cook-profile' ? 'active' : ''}`}
                onClick={() => setCurrentView('cook-profile')}
              >
                Store Profile
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <button 
                className={`nav-link-btn ${currentView === 'admin' ? 'active' : ''}`}
                onClick={() => setCurrentView('admin')}
              >
                <ShieldCheck size={16} color="#4F46E5" />
                Safety & Compliance Hub
              </button>
              <button 
                className={`nav-link-btn ${currentView === 'discovery' ? 'active' : ''}`}
                onClick={() => setCurrentView('discovery')}
              >
                Active Cook Network
              </button>
            </>
          )}
        </nav>

        {/* Right Actions: Restricted Portal Triggers & Identity Badge */}
        <div className="flex items-center gap-3">
          {/* Cart Icon (Customer/Guest View) */}
          {(isCustomer || isGuest) && (
            <button 
              className="cart-indicator-btn" 
              onClick={() => setIsCartOpen(true)}
              title="Open Tiffin Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="cart-count-badge">{cartCount}</span>
              )}
            </button>
          )}

          {isGuest ? (
            <button 
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              onClick={() => onOpenAuthModal('customer')}
            >
              <User size={16} />
              Log In / Sign Up
            </button>
          ) : (
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                padding: '4px 12px',
                background: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid #CBD5E1',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentView('profile')}
              title="View Profile"
            >
              <div 
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: currentUser.profilePic ? `url(${currentUser.profilePic}) center/cover` : (isCook ? '#FEF3C7' : isAdmin ? '#EEF2FF' : '#FFF0EB'),
                  color: isCook ? '#B45309' : isAdmin ? '#4338CA' : '#FF5520',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.8rem'
                }}
              >
                {!currentUser.profilePic && currentUser.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{currentUser.name}</span>
                  <span 
                    className="badge-tag"
                    style={{ 
                      fontSize: '0.66rem', 
                      padding: '2px 6px',
                      background: isCook ? '#FEF3C7' : isAdmin ? '#EEF2FF' : '#ECFDF5',
                      color: isCook ? '#92400E' : isAdmin ? '#3730A3' : '#047857'
                    }}
                  >
                    {isCook ? 'Cook' : isAdmin ? 'Admin' : 'Customer'}
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', fontFamily: 'monospace', fontWeight: 600 }}>
                  ID: {currentUser.uniqueId}
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onLogout();
                }}
                style={{ 
                  background: '#F1F5F9', 
                  border: '1px solid #CBD5E1', 
                  borderRadius: '6px', 
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer'
                }}
                title="Log out"
              >
                <LogOut size={12} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
