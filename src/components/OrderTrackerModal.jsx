import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Bike, 
  Sparkles, 
  MapPin, 
  Phone,
  ShieldCheck
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Rider icon
const riderIcon = new L.DivIcon({
  className: 'custom-leaflet-icon',
  html: '<div style="background: #FF5520; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🛵</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 30]
});

// Home icon for customer
const homeIcon = new L.DivIcon({
  className: 'custom-leaflet-icon',
  html: '<div style="background: #10B981; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🏠</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 30]
});

// Component to dynamically recenter map
function MapUpdater({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function OrderTrackerModal({ order, onClose }) {
  if (!order) return null;

  const [step, setStep] = useState(1);
  const [liveOrder, setLiveOrder] = useState(order);

  // States for live GPS coordinates
  const [customerLocation, setCustomerLocation] = useState([12.9716, 77.5946]);
  const [riderLocation, setRiderLocation] = useState([12.9600, 77.5900]);

  // Fetch actual GPS location for the customer
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCustomerLocation([lat, lng]);
          // For demo purposes, start the rider slightly away from the real GPS location
          setRiderLocation([lat - 0.015, lng - 0.015]);
        },
        (err) => console.error("Error getting location: ", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    // Initial fetch and polling every 3 seconds
    const fetchOrderStatus = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/order/${order.id}`);
        const data = await res.json();
        if (data.order) {
          setLiveOrder(data.order);
          // Map backend status to UI steps
          const status = data.order.status;
          if (status === 'Delivered') setStep(5);
          else if (status.includes('Rider') || status === 'Dispatched') setStep(4);
          else if (status.includes('Simmering') || status.includes('Packed')) setStep(3);
          else if (status.includes('Accepted') || status.includes('Confirmed')) setStep(2);
          else setStep(1); // Pending / Matched
        }
      } catch (err) {
        console.error("Error fetching live order status", err);
      }
    };

    fetchOrderStatus(); // Fetch immediately
    const interval = setInterval(fetchOrderStatus, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [order.id]);

  // Simulate rider movement towards customer
  useEffect(() => {
    if (step >= 4) {
      const moveInterval = setInterval(() => {
        setRiderLocation(prev => {
          // Move 10% closer each tick
          const newLat = prev[0] + (customerLocation[0] - prev[0]) * 0.1;
          const newLng = prev[1] + (customerLocation[1] - prev[1]) * 0.1;
          return [newLat, newLng];
        });
      }, 2000);
      return () => clearInterval(moveInterval);
    }
  }, [step]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="badge-tag badge-emerald" style={{ marginBottom: '8px' }}>
            <Sparkles size={14} />
            LIVE ORDER TRACKING
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#0F172A', marginBottom: '4px' }}>
            Order #{order.id}
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.88rem' }}>
            Matched with <strong>{order.cook}</strong>
          </p>
        </div>

        {/* Estimated Time Card */}
        <div 
          style={{ 
            background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)', 
            border: '1.5px solid #FDE68A', 
            borderRadius: 'var(--radius-md)', 
            padding: '16px 20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '28px' 
          }}
        >
          <div>
            <div style={{ fontSize: '0.76rem', color: '#B45309', fontWeight: 700, textTransform: 'uppercase' }}>
              Estimated Delivery
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#92400E' }}>
              {step >= 4 ? '12 – 15 Mins' : '20 – 24 Mins'}
            </div>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
            <Clock size={24} />
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="order-tracker-timeline">
          {/* Step 1 */}
          <div className={`tracker-node ${step >= 1 ? 'completed' : ''}`}>
            <div className="tracker-icon">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>
                AI Matched Demand to Kitchen
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Allocated to nearest available stove slot
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className={`tracker-node ${step >= 2 ? (step === 2 ? 'current' : 'completed') : ''}`}>
            <div className="tracker-icon">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>
                Cook Simran Confirmed
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Fresh ingredients gathered from 6 AM market haul
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className={`tracker-node ${step >= 3 ? (step === 3 ? 'current' : 'completed') : ''}`}>
            <div className="tracker-icon">
              <Flame size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>
                Simmering on Stove & Hot Packing
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Phulkas puffed on tawa and brushed with desi ghee
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className={`tracker-node ${step >= 4 ? (step === 4 ? 'current' : 'completed') : ''}`}>
            <div className="tracker-icon">
              <Bike size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>
                Rider Dispatched (Eco-Delivery)
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Rider Rajesh picked up insulated tiffin box (1.2 km away)
              </div>
            </div>
          </div>
        </div>

        {/* Live Map Tracking (Only visible when rider dispatched) */}
        {step >= 4 && (
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#FF5520" /> Live GPS Tracking
            </h3>
            <div style={{ height: '200px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #E2E8F0', zIndex: 1 }}>
              <MapContainer center={riderLocation} zoom={14} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={riderLocation} />
                
                <Marker position={customerLocation} icon={homeIcon}>
                  <Popup>Delivery Location</Popup>
                </Marker>
                
                <Marker position={riderLocation} icon={riderIcon}>
                  <Popup>Rider is on the way!</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}

        {/* Order Details Summary */}
        <div style={{ background: '#FAF8F5', border: '1px solid #EBE5DB', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginTop: '20px', fontSize: '0.84rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#64748B' }}>Items:</span>
            <strong style={{ color: '#0F172A' }}>{order.items}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#64748B' }}>Delivery Address:</span>
            <span>{order.deliveryAddress}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748B' }}>Total Paid:</span>
            <strong style={{ color: '#FF5520' }}>₹{order.price}</strong>
          </div>
        </div>

        <button 
          className="btn-primary" 
          style={{ width: '100%', marginTop: '20px', padding: '12px' }}
          onClick={onClose}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
