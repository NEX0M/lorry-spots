import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const AddSpot = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lat: '',
    lng: '',
    amenities: { fuel: false, food: false, shower: false, security: false }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    setFormData({ 
      ...formData, 
      amenities: { ...formData.amenities, [e.target.name]: e.target.checked } 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "spots"), {
        ...formData,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        status: "pending", // Sends to moderation queue
        submittedBy: auth.currentUser ? auth.currentUser.uid : "anonymous",
        createdAt: new Date()
      });
      alert("Spot submitted for review!");
    } catch (err) {
      console.error(err);
      alert("Error submitting spot.");
    }
  };

  // Note: In a real app, you would add a mini-map here to let users click to set Lat/Lng
  return (
    <div className="form-container">
      <h2>Add a Safe Stop</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Location Name" onChange={handleChange} required />
        <textarea name="description" placeholder="Notes (e.g., 'Quiet, well lit')" onChange={handleChange} />
        
        <div className="geo-inputs">
          <input name="lat" placeholder="Latitude" onChange={handleChange} required />
          <input name="lng" placeholder="Longitude" onChange={handleChange} required />
        </div>

        <div className="amenities-check">
          <label><input type="checkbox" name="security" onChange={handleCheckbox} /> 🔒 Security</label>
          <label><input type="checkbox" name="shower" onChange={handleCheckbox} /> 🚿 Shower</label>
          <label><input type="checkbox" name="food" onChange={handleCheckbox} /> 🍔 Food</label>
          <label><input type="checkbox" name="fuel" onChange={handleCheckbox} /> ⛽ Fuel</label>
        </div>

        <button type="submit">Submit for Review</button>
      </form>
    </div>
  );
};

export default AddSpot;