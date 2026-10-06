import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import CustomerDashboard from './components/CustomerDashboard';
import CustomerOrdersPage from './components/CustomerOrdersPage';
import FoodDiscovery from './components/FoodDiscovery';
import AIMatchingScreen from './components/AIMatchingScreen';
import CookHome from './components/cook/CookHome';
import CookCapacity from './components/cook/CookCapacity';
import CookOrders from './components/cook/CookOrders';
import CookEarnings from './components/cook/CookEarnings';
import CookProfile from './components/cook/CookProfile';
import AdminSafetyDashboard from './components/AdminSafetyDashboard';
import CookProfileModal from './components/CookProfileModal';
import CartModal from './components/CartModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import AuthModal from './components/AuthModal';
import AccessDenied from './components/AccessDenied';
import UserProfilePage from './components/UserProfilePage';
import { 
  REGISTERED_ACCOUNTS, 
  INITIAL_ORDERS, 
  HOME_COOKS,
  calculateDeliveryFee 
} from './data/mockData';
import { Flame, Heart, ShieldCheck, Sparkles, Lock } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  
  // Authenticated user session
  const [currentUser, setCurrentUser] = useState(null);
  
  // Restricted portal auth modal state
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    targetPortal: 'customer' // 'customer' | 'cook' | 'admin'
  });

  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // Fetch user orders when they log in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'cook' || currentUser.role === 'admin') {
        fetch(`${import.meta.env.VITE_API_URL}/api/orders/all`)
          .then(res => res.json())
          .then(data => {
            if (data.orders) setOrders(data.orders);
          })
          .catch(err => console.error('Error fetching all orders:', err));
      } else {
        fetch(`${import.meta.env.VITE_API_URL}/api/orders/${currentUser.uniqueId}`)
          .then(res => res.json())
          .then(data => {
            if (data.orders) setOrders(data.orders);
          })
          .catch(err => console.error('Error fetching orders:', err));
      }
    } else {
      setOrders(INITIAL_ORDERS);
    }
  }, [currentUser]);
  
  // Cart state
  const [cartItems, setCartItems] = useState([
    {
      id: 'm1-5',
      name: 'Full Tiffin Thali (AI Recommended)',
      price: 100,
      quantity: 1,
      cookName: 'Maa Ki Rasoi'
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals
  const [selectedCook, setSelectedCook] = useState(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);
  const [notification, setNotification] = useState(null);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3800);
  };

  // Auth operations
  const handleOpenAuthModal = (target) => {
    setAuthModal({
      isOpen: true,
      targetPortal: target
    });
  };

  const handleSuccessLogin = (account) => {
    setCurrentUser(account);
    if (account.role === 'cook') {
      setCurrentView('cook-home');
      showToast(`👩‍🍳 Welcome, ${account.name}! Authenticated with Cook Partner ID: ${account.uniqueId}`);
    } else if (account.role === 'admin') {
      setCurrentView('admin');
      showToast(`🛡️ Compliance Session Active: ${account.name} (ID: ${account.uniqueId})`);
    } else {
      setCurrentView('dashboard');
      showToast(`👋 Welcome back, ${account.name}!`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
    showToast(`Successfully logged out.`);
  };

  // Cart operations
  const handleAddToCart = (item, cook, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: qty,
        cookName: cook.name
      }];
    });
    showToast(`Added ${item.name} from ${cook.name} to tiffin box!`);
  };

  const handleUpdateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Quick order recommended thali
  const handleQuickOrderThali = (cook) => {
    const thali = cook.menu.find(m => m.isThali) || cook.menu[0];
    handleAddToCart(thali, cook, 1);
    setIsCartOpen(true);
  };

  // AI Match direct order placement with distance-based delivery fee
  const handleConfirmAiOrder = (cook, item) => {
    if (!currentUser) {
      showToast("Please log in to place an order.");
      handleOpenAuthModal('customer');
      return;
    }
    const deliveryCalc = calculateDeliveryFee(cook.distanceKm);
    const totalPrice = item.price + deliveryCalc.fee;

    const newOrder = {
      id: `TM-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: currentUser.name,
      customerId: currentUser.uniqueId,
      cookName: cook.name,
      items: item.name,
      foodCategory: cook.cuisine || 'Mixed',
      price: totalPrice,
      deliveryFee: deliveryCalc.fee,
      status: 'Matched',
      orderedAt: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      deliveryAddress: `Near Koramangala 4th Block (${cook.distanceKm} km)`,
      estimatedDelivery: '18–22 mins'
    };

    fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(err => console.error('Error saving order:', err));

    setOrders([newOrder, ...orders]);
    setActiveTrackingOrder(newOrder);
    showToast(`🎉 Order confirmed with ${cook.name}! Total: ₹${totalPrice} (includes ₹${deliveryCalc.fee} delivery fee).`);
  };

  // Cart checkout with tiered delivery fee and payment method
  const handleCheckout = (totalAmount, deliveryFee, addressLabel, distanceKm, paymentMethod = 'UPI') => {
    if (!currentUser) {
      showToast("Please log in to checkout.");
      handleOpenAuthModal('customer');
      return;
    }
    const itemNames = cartItems.map(i => `${i.name} (x${i.quantity})`).join(', ');
    const newOrder = {
      id: `TM-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: currentUser.name,
      customerId: currentUser.uniqueId,
      cookName: cartItems[0]?.cookName || 'Maa Ki Rasoi',
      items: itemNames,
      foodCategory: 'Mixed',
      price: totalAmount,
      deliveryFee: deliveryFee,
      status: 'Matched',
      orderedAt: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      deliveryAddress: `${addressLabel} (${distanceKm} km)`,
      estimatedDelivery: distanceKm < 4 ? '18–22 mins' : distanceKm <= 6 ? '25–30 mins' : '35–45 mins'
    };

    fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(err => console.error('Error saving order:', err));

    setOrders([newOrder, ...orders]);
    setCartItems([]);
    setIsCartOpen(false);
    setActiveTrackingOrder(newOrder);
    showToast(`🎉 Tiffin order placed via ${paymentMethod.toUpperCase()}! Total: ₹${totalAmount} (Delivery fee: ₹${deliveryFee}).`);
  };

  // Update order status in Cook Portal
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(err => console.error('Error updating status:', err));

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order ${orderId} updated to: ${newStatus}`);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {notification && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0F172A',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            border: '1px solid #334155',
            animation: 'slideUp 0.25s ease'
          }}
        >
          <Sparkles size={16} color="#FF5520" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Sticky Navigation with Boundary Controls & Unique IDs */}
      <Navbar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
        cartCount={cartCount}
        setIsCartOpen={setIsCartOpen}
      />

      {/* Main Content Body with Security Route Guards */}
      <main style={{ flexGrow: 1 }}>
        {/* Landing Page */}
        {currentView === 'landing' && (
          <LandingPage 
            setCurrentView={setCurrentView}
            onOpenAuthModal={handleOpenAuthModal}
          />
        )}

        {/* Customer Dashboard */}
        {currentView === 'dashboard' && (
          currentUser?.role === 'customer' ? (
            <CustomerDashboard 
              user={currentUser}
              setCurrentView={setCurrentView}
              onSelectCook={(cook) => setSelectedCook(cook)}
              onQuickOrderThali={handleQuickOrderThali}
              orders={orders}
              onTrackOrder={(order) => setActiveTrackingOrder(order)}
            />
          ) : (
            <AccessDenied 
              portalName="the Customer Dashboard"
              user={currentUser}
              onOpenLogin={() => handleOpenAuthModal('customer')}
              onReturnToDashboard={() => setCurrentView('landing')}
            />
          )
        )}

        {/* Customer Orders Page */}
        {currentView === 'orders' && (
          currentUser?.role === 'customer' ? (
            <CustomerOrdersPage 
              user={currentUser}
              orders={orders}
              onTrackOrder={(order) => setActiveTrackingOrder(order)}
            />
          ) : (
            <AccessDenied 
              portalName="the Customer Orders Page"
              user={currentUser}
              onOpenLogin={() => handleOpenAuthModal('customer')}
              onReturnToDashboard={() => setCurrentView('landing')}
            />
          )
        )}

        {/* User Profile Page */}
        {currentView === 'profile' && (
          currentUser ? (
            <UserProfilePage 
              user={currentUser} 
              onUpdateUser={(updated) => {
                setCurrentUser(updated);
                showToast(`Profile updated successfully!`);
              }} 
            />
          ) : (
            <AccessDenied 
              portalName="the Profile Settings"
              user={currentUser}
              onOpenLogin={() => handleOpenAuthModal('customer')}
              onReturnToDashboard={() => setCurrentView('landing')}
            />
          )
        )}

        {/* Food Discovery */}
        {currentView === 'discovery' && (
          <FoodDiscovery 
            onSelectCook={(cook) => setSelectedCook(cook)}
            setCurrentView={setCurrentView}
          />
        )}

        {/* AI Matching Screen */}
        {currentView === 'ai-match' && (
          <AIMatchingScreen 
            onConfirmOrder={handleConfirmAiOrder}
            onSelectCook={(cook) => setSelectedCook(cook)}
          />
        )}

        {/* Home Cook Portal Pages: STRICTLY GUARDED */}
        {currentView === 'cook-home' && (
          currentUser?.role === 'cook' ? <CookHome user={currentUser} orders={orders} /> : <AccessDenied portalName="Cook Portal" user={currentUser} onOpenLogin={() => handleOpenAuthModal('cook')} onReturnToDashboard={() => setCurrentView('landing')} />
        )}
        
        {currentView === 'cook-capacity' && (
          currentUser?.role === 'cook' ? <CookCapacity user={currentUser} orders={orders} /> : <AccessDenied portalName="Cook Portal" user={currentUser} onOpenLogin={() => handleOpenAuthModal('cook')} onReturnToDashboard={() => setCurrentView('landing')} />
        )}

        {currentView === 'cook-orders' && (
          currentUser?.role === 'cook' ? (
            <CookOrders orders={orders.filter(o => o.cook === currentUser.name)} onUpdateOrderStatus={handleUpdateOrderStatus} />
          ) : <AccessDenied portalName="Cook Portal" user={currentUser} onOpenLogin={() => handleOpenAuthModal('cook')} onReturnToDashboard={() => setCurrentView('landing')} />
        )}

        {currentView === 'cook-earnings' && (
          currentUser?.role === 'cook' ? <CookEarnings user={currentUser} orders={orders} /> : <AccessDenied portalName="Cook Portal" user={currentUser} onOpenLogin={() => handleOpenAuthModal('cook')} onReturnToDashboard={() => setCurrentView('landing')} />
        )}

        {currentView === 'cook-profile' && (
          currentUser?.role === 'cook' ? <CookProfile user={currentUser} /> : <AccessDenied portalName="Cook Portal" user={currentUser} onOpenLogin={() => handleOpenAuthModal('cook')} onReturnToDashboard={() => setCurrentView('landing')} />
        )}

        {/* Admin Safety Dashboard: STRICTLY GUARDED */}
        {currentView === 'admin' && (
          currentUser?.role === 'admin' ? (
            <AdminSafetyDashboard />
          ) : (
            <AccessDenied 
              portalName="the Platform Safety & Compliance Hub"
              user={currentUser}
              onOpenLogin={() => handleOpenAuthModal('admin')}
              onReturnToDashboard={() => setCurrentView('landing')}
            />
          )
        )}
      </main>

      {/* Cook Profile Modal */}
      {selectedCook && (
        <CookProfileModal 
          cook={selectedCook}
          onClose={() => setSelectedCook(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Drawer with Multi-Step Checkout (Bag -> Address -> Payment) */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        user={currentUser}
        orders={orders}
      />

      {/* Live Order Tracker Modal */}
      {activeTrackingOrder && (
        <OrderTrackerModal 
          order={activeTrackingOrder}
          onClose={() => setActiveTrackingOrder(null)}
        />
      )}

      {/* Restricted Portal Authentication Modal */}
      <AuthModal 
        isOpen={authModal.isOpen}
        targetPortal={authModal.targetPortal}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        onSuccessLogin={handleSuccessLogin}
      />

      {/* Rich Modern Footer */}
      <footer 
        style={{
          background: '#0F172A',
          color: '#94A3B8',
          padding: '56px 0 32px',
          borderTop: '1px solid #1E293B',
          marginTop: '64px'
        }}
      >
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '40px', marginBottom: '48px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div className="brand-icon">
                  <Flame color="#ffffff" size={20} />
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  Tiffin<span style={{ color: '#FF5520' }}>Match</span>
                </span>
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6, maxWidth: '340px', color: '#94A3B8', marginBottom: '18px' }}>
                AI-powered matching between local food demand and unused home-kitchen capacity. Connecting students, bachelors, and workers with loving neighborhood cooks.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', padding: '6px 12px', borderRadius: '9999px', fontSize: '0.78rem', color: '#CBD5E1' }}>
                <ShieldCheck size={14} color="#10B981" />
                100% Kitchen Hygiene Verified
              </div>
            </div>

            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '16px' }}>For Customers</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
                <li><button onClick={() => setCurrentView('discovery')} style={{ color: '#94A3B8' }}>Find Home Food</button></li>
                <li><button onClick={() => setCurrentView('ai-match')} style={{ color: '#94A3B8' }}>AI Matchmaker</button></li>
                <li><button onClick={() => setCurrentView('dashboard')} style={{ color: '#94A3B8' }}>Student Meal Pass (25% off)</button></li>
                <li><button onClick={() => setCurrentView('dashboard')} style={{ color: '#94A3B8' }}>Daily North Indian Thali</button></li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '16px' }}>Home Cook Partners</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
                <li>
                  <button 
                    onClick={() => handleOpenAuthModal('cook')} 
                    style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Lock size={12} /> Partner Kitchen Login
                  </button>
                </li>
                <li><span style={{ color: '#64748B' }}>Capacity Monetization</span></li>
                <li><span style={{ color: '#64748B' }}>Weekly Payout Engine</span></li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '16px' }}>Trust & Safety</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
                <li>
                  <button 
                    onClick={() => handleOpenAuthModal('admin')} 
                    style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Lock size={12} /> Officer Compliance Hub
                  </button>
                </li>
                <li><span style={{ color: '#64748B' }}>FSSAI Registration Check</span></li>
                <li><span style={{ color: '#64748B' }}>Water Quality TDS &lt; 90</span></li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1E293B', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748B', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              © 2026 TiffinMatch Technologies. Prototype Demonstration. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Kitchen Safety Charter</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
