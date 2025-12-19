import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MapView from './components/MapView';
import AddSpot from './components/AddSpot';
import AdminPanel from './components/AdminPanel';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav style={{ padding: '10px', background: '#282c34', color: 'white', display: 'flex', gap: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '1.2rem' }}>🚛 LorryLog</h1>
          <Link to="/" style={{ color: '#61dafb', textDecoration: 'none' }}>Map</Link>
          <Link to="/add" style={{ color: '#61dafb', textDecoration: 'none' }}>Add Spot</Link>
          <Link to="/admin" style={{ color: '#61dafb', textDecoration: 'none' }}>Admin</Link>
        </nav>

        <Routes>
          <Route path="/" element={<MapView />} />
          <Route path="/add" element={<AddSpot />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;