import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Star } from 'lucide-react';

// Fix for default leaflet icons not showing up due to webpack issues in standard React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to dynamically recenter map when user location changes
function MapUpdater({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function KitchenMap({ userLocation, onSelectCook, cooks = [] }) {
  // Cook Icon - simple div icon with emoji
  const cookIcon = new L.DivIcon({
    className: 'custom-leaflet-icon',
    html: '<div style="background: #FF5520; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">👩‍🍳</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid #E2E8F0', zIndex: 1 }}>
      <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={userLocation} />

        {/* Customer Location */}
        <Marker position={userLocation}>
          <Popup>
            <strong>Your Location</strong><br/>
            Finding nearby kitchens...
          </Popup>
        </Marker>

        {/* Home Cooks Locations */}
        {cooks.map(cook => {
          if (!cook.lat || !cook.lng) return null;
          return (
            <Marker 
              key={cook.id} 
              position={[cook.lat, cook.lng]}
              icon={cookIcon}
            >
              <Popup>
                <div style={{ padding: '4px 0', minWidth: '180px' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', marginBottom: '4px' }}>
                    {cook.name}
                  </div>
                  <div style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '8px' }}>
                    {cook.cuisine} • {cook.distanceKm} km away
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#D97706', fontWeight: 600, marginBottom: '12px' }}>
                    <Star size={14} fill="#D97706" /> {cook.rating} ({cook.reviewsCount})
                  </div>
                  <button 
                    onClick={() => onSelectCook(cook)}
                    style={{ background: '#FF5520', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 600, fontSize: '0.85rem' }}
                  >
                    View Menu
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
