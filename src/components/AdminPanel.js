import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const AdminPanel = () => {
  const [pendingSpots, setPendingSpots] = useState([]);

  const fetchPending = async () => {
    const q = query(collection(db, "spots"), where("status", "==", "pending"));
    const snapshot = await getDocs(q);
    setPendingSpots(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchPending(); }, []);

  const handleApprove = async (id) => {
    const spotRef = doc(db, "spots", id);
    await updateDoc(spotRef, { status: "approved" });
    fetchPending(); // Refresh list
  };

  const handleReject = async (id) => {
    await deleteDoc(doc(db, "spots", id));
    fetchPending();
  };

  return (
    <div className="admin-container">
      <h2>Moderation Queue</h2>
      {pendingSpots.length === 0 ? <p>No pending submissions.</p> : (
        <ul className="pending-list">
          {pendingSpots.map(spot => (
            <li key={spot.id} className="pending-item">
              <div>
                <strong>{spot.name}</strong> ({spot.lat}, {spot.lng})
                <p>{spot.description}</p>
                <small>Amenities: {JSON.stringify(spot.amenities)}</small>
              </div>
              <div className="actions">
                <button className="approve-btn" onClick={() => handleApprove(spot.id)}>Approve</button>
                <button className="reject-btn" onClick={() => handleReject(spot.id)}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPanel;