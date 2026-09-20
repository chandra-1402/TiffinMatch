import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MapPin, 
  Tag, 
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Bike,
  CreditCard,
  Smartphone,
  Banknote,
  GraduationCap,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Lock
} from 'lucide-react';
import { DELIVERY_ADDRESSES, calculateDeliveryFee } from '../data/mockData';

export default function CartModal({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  user,
  orders = []
}) {
  // Step state: 'bag' | 'address' | 'payment'
  const [checkoutStep, setCheckoutStep] = useState('bag');
  
  // Bag state
  const [coupon, setCoupon] = useState('STUDENT25');
  const [discountApplied, setDiscountApplied] = useState(true);
  const [showRecentOrders, setShowRecentOrders] = useState(false);

  // Address state
  const [selectedAddressId, setSelectedAddressId] = useState('addr-1');
  const [isCustomDistance, setIsCustomDistance] = useState(false);
  const [customDistance, setCustomDistance] = useState(1.8);
  const [deliveryNote, setDeliveryNote] = useState('');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cod' | 'student-pass'

  if (!isOpen) return null;

  // Lock delivery to user's live location
  const activeDistance = 2.5; // Estimated live distance
  const addressLabel = user ? user.location : 'Your Live Location';
  const addressDetail = 'Delivering directly to your live location.';

  // Calculate delivery fee using the specified tiered rules:
  // - < 4 km: ₹40
  // - 4 to 6 km: ₹50
  // - > 6 km: ₹50 + ₹10/km extra
  const deliveryCalculation = calculateDeliveryFee(activeDistance);
  const deliveryFee = deliveryCalculation.fee;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = discountApplied ? Math.min(25, subtotal) : 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleCloseAndReset = () => {
    setCheckoutStep('bag');
    onClose();
  };

  const handleFinalCheckout = () => {
    onCheckout(total, deliveryFee, addressLabel, activeDistance, paymentMethod);
    setCheckoutStep('bag');
  };

  return (
    <div className="cart-drawer-overlay" onClick={handleCloseAndReset}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()} style={{ width: '500px' }}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#FF5520" />
            <h3 style={{ fontSize: '1.25rem', color: '#0F172A' }}>
              {checkoutStep === 'bag' && `Tiffin Bag (${cartItems.reduce((a, b) => a + b.quantity, 0)} items)`}
              {checkoutStep === 'address' && 'Delivery Address & Distance'}
              {checkoutStep === 'payment' && 'Select Payment Method'}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={handleCloseAndReset} style={{ position: 'static' }}>
            <X size={18} />
          </button>
        </div>

        {/* 3-Step Checkout Wizard Bar */}
        <div className="checkout-steps-bar">
          <div 
            className={`step-indicator-pill ${checkoutStep === 'bag' ? 'active' : 'completed'}`}
            onClick={() => setCheckoutStep('bag')}
          >
            <div className="step-indicator-circle">
              {checkoutStep !== 'bag' ? '✓' : '1'}
            </div>
            <span>Bag</span>
          </div>

          <div className="step-divider-line" />

          <div 
            className={`step-indicator-pill ${checkoutStep === 'address' ? 'active' : (checkoutStep === 'payment' ? 'completed' : '')}`}
            onClick={() => {
              if (cartItems.length > 0) setCheckoutStep('address');
            }}
          >
            <div className="step-indicator-circle">
              {checkoutStep === 'payment' ? '✓' : '2'}
            </div>
            <span>Address</span>
          </div>

          <div className="step-divider-line" />

          <div 
            className={`step-indicator-pill ${checkoutStep === 'payment' ? 'active' : ''}`}
            onClick={() => {
              if (cartItems.length > 0) setCheckoutStep('payment');
            }}
          >
            <div className="step-indicator-circle">3</div>
            <span>Payment</span>
          </div>
        </div>

        {/* =========================================================
            STEP 1: BAG / LIST OF ITEMS & RECENT ORDERS
        ========================================================= */}
        {checkoutStep === 'bag' && (
          <>
            <div className="cart-items-list">
              {/* Itemized list of orders in bag */}
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                Items in Your Tiffin Bag
              </div>

              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🍱</div>
                  <h4 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '6px' }}>Your tiffin bag is empty</h4>
                  <p style={{ fontSize: '0.85rem' }}>Select wholesome homestyle meals from nearby verified cooks.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item-row">
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.94rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{item.name}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                          Prepared by: <strong>{item.cookName}</strong>
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FF5520', marginTop: '4px' }}>
                          ₹{item.price * item.quantity} <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>(₹{item.price} each)</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '9999px', padding: '3px 10px' }}>
                          <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                            <Minus size={13} />
                          </button>
                          <span style={{ fontSize: '0.84rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                            <Plus size={13} />
                          </button>
                        </div>

                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          style={{ color: '#94A3B8', padding: '6px' }}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Collapsible Recent Orders List */}
              {orders.length > 0 && (
                <div style={{ marginTop: '20px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                  <button 
                    onClick={() => setShowRecentOrders(!showRecentOrders)}
                    style={{ 
                      width: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: '#475569',
                      padding: '8px 0'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={15} color="#FF5520" />
                      View Recent Orders & History ({orders.length})
                    </span>
                    {showRecentOrders ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {showRecentOrders && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                      {orders.slice(0, 3).map(order => (
                        <div 
                          key={order.id}
                          style={{ 
                            background: '#F8FAFC', 
                            border: '1px solid #E2E8F0', 
                            borderRadius: 'var(--radius-sm)', 
                            padding: '10px 12px',
                            fontSize: '0.8rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                            <span>{order.id} • {order.cook}</span>
                            <span style={{ color: '#059669' }}>₹{order.price}</span>
                          </div>
                          <div style={{ color: '#64748B', fontSize: '0.76rem' }}>
                            {order.items}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.72rem', color: '#94A3B8' }}>
                            <span>Status: {order.status}</span>
                            <span>{order.orderedAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bag Footer with Subtotal & Proceed Button */}
            {cartItems.length > 0 && (
              <div className="cart-drawer-footer">
                {/* Coupon Box */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ position: 'relative', flexGrow: 1 }}>
                    <Tag size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      value={coupon} 
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Coupon code"
                      className="filter-input"
                      style={{ paddingLeft: '32px', width: '100%', fontSize: '0.82rem', textTransform: 'uppercase' }}
                    />
                  </div>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                    onClick={() => setDiscountApplied(true)}
                  >
                    Apply
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569', marginBottom: '6px' }}>
                  <span>Items Subtotal:</span>
                  <strong style={{ color: '#0F172A' }}>₹{subtotal}</strong>
                </div>

                {discountApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#059669', fontWeight: 600, marginBottom: '14px' }}>
                    <span>Student Discount (STUDENT25):</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <button 
                  className="btn-primary" 
                  style={{ width: '100%', padding: '14px' }}
                  onClick={() => setCheckoutStep('address')}
                >
                  Proceed to Delivery Address
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </>
        )}

        {/* =========================================================
            STEP 2: ADDRESS SECTION & TIERED DELIVERY CHARGE
        ========================================================= */}
        {checkoutStep === 'address' && (
          <>
            <div className="cart-items-list" style={{ gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Delivery Location
                </span>
                <span style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} /> Live Location Locked
                </span>
              </div>

              {/* Locked Live Location Card */}
              <div className="selectable-card selected" style={{ cursor: 'default' }}>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <strong style={{ fontSize: '0.92rem', color: '#0F172A' }}>{addressLabel}</strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', margin: '4px 0' }}>
                    {addressDetail}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Bike size={12} /> Approx. {activeDistance} km from kitchen
                  </div>
                </div>
              </div>

              {/* Real-time Delivery Fee Calculation Card */}
              <div 
                style={{ 
                  background: activeDistance < 4 ? '#ECFDF5' : activeDistance <= 6 ? '#EFF6FF' : '#FFF7ED',
                  border: `1.5px solid ${activeDistance < 4 ? '#A7F3D0' : activeDistance <= 6 ? '#BFDBFE' : '#FED7AA'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.86rem', color: activeDistance < 4 ? '#065F46' : activeDistance <= 6 ? '#1E40AF' : '#9A3412' }}>
                    <Bike size={16} />
                    <span>Delivery Fee for {activeDistance} km</span>
                  </div>
                  <strong style={{ fontSize: '1.2rem', color: activeDistance < 4 ? '#047857' : activeDistance <= 6 ? '#1D4ED8' : '#C2410C' }}>
                    ₹{deliveryFee}
                  </strong>
                </div>
                <div style={{ fontSize: '0.76rem', color: activeDistance < 4 ? '#047857' : activeDistance <= 6 ? '#2563EB' : '#9A3412' }}>
                  {deliveryCalculation.breakdown}
                </div>
              </div>

              {/* Delivery Note / Instructions */}
              <div>
                <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: '4px' }}>
                  Drop-off Instructions (Optional)
                </label>
                <input 
                  type="text"
                  className="filter-input"
                  placeholder="E.g. Leave with PG security / call before arrival"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  style={{ width: '100%', fontSize: '0.84rem' }}
                />
              </div>
            </div>

            {/* Address Step Footer */}
            <div className="cart-drawer-footer">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#475569', marginBottom: '4px' }}>
                <span>Selected Destination:</span>
                <strong style={{ color: '#0F172A' }}>{addressLabel}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#475569', marginBottom: '14px' }}>
                <span>Delivery Charge:</span>
                <strong style={{ color: '#FF5520' }}>₹{deliveryFee}</strong>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={() => setCheckoutStep('bag')}
                >
                  <ArrowLeft size={16} />
                  Back to Bag
                </button>
                <button 
                  className="btn-primary" 
                  style={{ flex: 1.4 }}
                  onClick={() => setCheckoutStep('payment')}
                >
                  Proceed to Payment
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* =========================================================
            STEP 3: PAYMENT METHOD & FINAL CONFIRMATION
        ========================================================= */}
        {checkoutStep === 'payment' && (
          <>
            <div className="cart-items-list" style={{ gap: '14px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Choose Payment Method
              </div>

              {/* Payment Option 1: UPI */}
              <div 
                className={`selectable-card ${paymentMethod === 'upi' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <div className="radio-circle">
                  {paymentMethod === 'upi' && <div className="radio-circle-dot" />}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0F172A' }}>
                    <Smartphone size={18} color="#4F46E5" />
                    <span>UPI (Google Pay / PhonePe / Paytm)</span>
                    <span className="badge-tag badge-emerald" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>Fastest</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
                    Instant approval via any UPI app or QR scan
                  </div>
                </div>
              </div>

              {/* Payment Option 2: Credit / Debit Card */}
              <div 
                className={`selectable-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="radio-circle">
                  {paymentMethod === 'card' && <div className="radio-circle-dot" />}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0F172A' }}>
                    <CreditCard size={18} color="#2563EB" />
                    <span>Credit / Debit Card (Visa, RuPay, Master)</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
                    Secure 256-bit encrypted card processing
                  </div>
                </div>
              </div>

              {/* Payment Option 3: Cash on Delivery (COD) */}
              <div 
                className={`selectable-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div className="radio-circle">
                  {paymentMethod === 'cod' && <div className="radio-circle-dot" />}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0F172A' }}>
                    <Banknote size={18} color="#059669" />
                    <span>Cash on Tiffin Delivery (COD)</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
                    Pay cash directly to our neighborhood delivery partner
                  </div>
                </div>
              </div>

              {/* Payment Option 4: Student Meal Pass */}
              <div 
                className={`selectable-card ${paymentMethod === 'student-pass' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('student-pass')}
              >
                <div className="radio-circle">
                  {paymentMethod === 'student-pass' && <div className="radio-circle-dot" />}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0F172A' }}>
                    <GraduationCap size={18} color="#FF5520" />
                    <span>Student Meal Pass Balance</span>
                    <span className="badge-tag" style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.68rem', padding: '1px 6px' }}>18 meals left</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
                    Redeem 1 pre-purchased meal token from your student pass
                  </div>
                </div>
              </div>

              {/* Destination Summary Box */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: '0.78rem', color: '#475569' }}>
                <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                  📍 Delivering to: {addressLabel}
                </div>
                <div>{addressDetail}</div>
                {deliveryNote && <div style={{ color: '#D97706', marginTop: '2px' }}>Note: "{deliveryNote}"</div>}
              </div>
            </div>

            {/* Final Bill Breakdown & Pay Button */}
            <div className="cart-drawer-footer">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem', color: '#475569', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Items Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                {discountApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 600 }}>
                    <span>Student Discount (STUDENT25)</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Delivery Charge ({activeDistance} km)</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>₹{deliveryFee}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '10px', marginTop: '2px', fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                  <span>Final Payable</span>
                  <span style={{ color: '#FF5520' }}>₹{total}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={() => setCheckoutStep('address')}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <button 
                  className="btn-primary" 
                  style={{ flex: 1.6, padding: '14px' }}
                  onClick={handleFinalCheckout}
                >
                  <Lock size={16} />
                  Pay & Confirm (₹{total})
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
