import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Helper to center map on user
function LocationMarker() {
  const map = useMap();
  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, 10);
    });
  }, [map]);
  return null;
}

const MapView = () => {
  const [spots, setSpots] = useState([]);
  const [filters, setFilters] = useState({ fuel: false, food: false, shower: false, security: false });

  // Fetch Approved Spots
  useEffect(() => {
    const fetchSpots = async () => {
      const q = query(collection(db, "spots"), where("status", "==", "approved"));
      const querySnapshot = await getDocs(q);
      const spotsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSpots(spotsData);
    };
    fetchSpots();
  }, []);

  // Filter Logic
  const filteredSpots = spots.filter(spot => {
    if (filters.fuel && !spot.amenities.fuel) return false;
    if (filters.food && !spot.amenities.food) return false;
    if (filters.shower && !spot.amenities.shower) return false;
    if (filters.security && !spot.amenities.security) return false;
    return true;
  });

  const toggleFilter = (key) => setFilters(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="map-container">
      {/* Filter Bar */}
      <div className="filter-bar">
        {Object.keys(filters).map(key => (
          <button 
            key={key} 
            className={filters[key] ? 'active' : ''} 
            onClick={() => toggleFilter(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <MapContainer center={[51.505, -0.09]} zoom={5} style={{ height: "90vh", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        
        {filteredSpots.map(spot => (
          <Marker key={spot.id} position={[spot.lat, spot.lng]}>
            <Popup>
              <h3>{spot.name}</h3>
              <p>{spot.description}</p>
              <ul className="amenities-list">
                {spot.amenities.security && <li>🔒 Secure Parking</li>}
                {spot.amenities.shower && <li>🚿 Showers</li>}
                {spot.amenities.food && <li>🍔 Food</li>}
              </ul>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;