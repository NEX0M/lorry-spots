import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map clicks
function LocationPicker({ setPos }) {
  useMapEvents({
    click(e) {
      setPos(e.latlng);
    },
  });
  return null;
}

const AddSpot = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amenities: { fuel: false, food: false, shower: false, security: false }
  });
  const [position, setPosition] = useState(null); // Stores {lat, lng}
  const [loading, setLoading] = useState(false);

  // Get User's Current GPS Location
  const handleUseMyLocation = (e) => {
    e.preventDefault();
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => alert("Could not fetch location.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) return alert("Please select a location on the map!");
    
    setLoading(true);
    try {
      await addDoc(collection(db, "spots"), {
        ...formData,
        lat: position.lat,
        lng: position.lng,
        status: "pending",
        createdAt: new Date()
      });
      alert("Success! Spot submitted for review.");
      setFormData({ name: '', description: '', amenities: { fuel: false, food: false, shower: false, security: false } });
      setPosition(null);
    } catch (err) {
      console.error(err);
      alert("Error submitting.");
    }
    setLoading(false);
  };

  const toggleAmenity = (key) => {
    setFormData(prev => ({ 
      ...prev, 
      amenities: { ...prev.amenities, [key]: !prev.amenities[key] } 
    }));
  };

  return (
    <div className="container">
      <div className="card split-view">
        {/* Left Side: Form */}
        <form onSubmit={handleSubmit}>
          <h2>📍 Add New Spot</h2>
          
          <div className="form-group">
            <label>Location Name</label>
            <input 
              type="text" 
              placeholder="e.g. BP Truck Stop M1" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              placeholder="Notes on safety, capacity, noise level..." 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <label>Amenities</label>
          <div className="amenities-grid">
            {['fuel', 'food', 'shower', 'security'].map(key => (
              <label key={key} style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <input 
                  type="checkbox" 
                  checked={formData.amenities[key]} 
                  onChange={() => toggleAmenity(key)} 
                  style={{marginRight: '10px'}}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>

          <p style={{fontSize: '0.9rem', color: position ? 'green' : 'red'}}>
            {position ? `Selected: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : "⚠️ No location selected"}
          </p>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Spot"}
          </button>
        </form>

        {/* Right Side: Map Picker */}
        <div>
          <label>Pin Location on Map</label>
          <button className="btn-outline" onClick={handleUseMyLocation} style={{width: '100%'}}>
            🎯 Use My Current Location
          </button>
          
          <div className="map-picker">
             {/* Center map on UK by default, or user position if known */}
            <MapContainer center={position || [54.5, -4]} zoom={6} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker setPos={setPosition} />
              {position && <Marker position={position} />}
            </MapContainer>
          </div>
          <small>Click anywhere on the map to pin the parking spot.</small>
        </div>
      </div>
    </div>
  );
};

export default AddSpot;