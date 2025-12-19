import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

const AdminPanel = () => {
  const [pendingSpots, setPendingSpots] = useState([]);

  const fetchPending = async () => {
    const q = query(collection(db, "spots"), where("status", "==", "pending"));
    const snapshot = await getDocs(q);
    setPendingSpots(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchPending(); }, []);

  const handleApprove = async (id) => {
    await updateDoc(doc(db, "spots", id), { status: "approved" });
    fetchPending();
  };

  const handleReject = async (id) => {
    await deleteDoc(doc(db, "spots", id));
    fetchPending();
  };

  // --- NEW: Test Data Generator ---
  const loadTestData = async () => {
    const testSpots = [
      { name: "Rugby Truckstop", lat: 52.37, lng: -1.19, description: "Large capacity, good food.", status: "approved", amenities: { fuel: true, food: true, shower: true, security: true } },
      { name: "Carlisle Truck Inn", lat: 54.90, lng: -2.93, description: "Quiet at night, secure fence.", status: "approved", amenities: { fuel: true, food: true, shower: true, security: true } },
      { name: "Ashford International", lat: 51.13, lng: 0.90, description: "Near border, very busy.", status: "approved", amenities: { fuel: false, food: true, shower: false, security: true } },
    ];
    
    if (window.confirm("This will add 3 test spots to the public map. Continue?")) {
      testSpots.forEach(async (spot) => {
        await addDoc(collection(db, "spots"), spot);
      });
      alert("Test data added! Refresh the map.");
    }
  };

  return (
    <div className="container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2>🛡️ Moderation Queue</h2>
        <button onClick={loadTestData} style={{background: '#95a5a6', color: 'white', fontSize: '0.8rem'}}>
          + Load Test Data
        </button>
      </div>

      <div className="card">
        {pendingSpots.length === 0 ? <p style={{color: '#999'}}>No pending submissions.</p> : (
          <div>
            {pendingSpots.map(spot => (
              <div key={spot.id} className="spot-item">
                <div className="spot-info">
                  <h4>{spot.name}</h4>
                  <p>{spot.description}</p>
                  <div style={{marginTop: '5px'}}>
                    {spot.amenities.fuel && <span className="amenity-tag">Fuel</span>}
                    {spot.amenities.food && <span className="amenity-tag">Food</span>}
                    {spot.amenities.security && <span className="amenity-tag">Security</span>}
                  </div>
                </div>
                <div className="actions">
                  <button className="btn-approve" onClick={() => handleApprove(spot.id)}>Approve</button>
                  <button className="btn-danger" onClick={() => handleReject(spot.id)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;