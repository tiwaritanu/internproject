// ShareLocation.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './ShareLocation.css';
import Sidebar from '../components/Sidebar'; // Import Sidebar

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ShareLocation = () => {
  const [formData, setFormData] = useState({
    address: '',
    latitude: '',
    longitude: '',
    landmark: '',
    contact: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch existing location on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:5000/api/location', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const { address, latitude, longitude, landmark, contact } = res.data;
        setFormData({ address, latitude, longitude, landmark, contact });
      })
      .catch((err) => {
        if (err.response?.status !== 404) console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in.');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/location',
        {
          address: formData.address,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          landmark: formData.landmark,
          contact: formData.contact,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save location');
    }
  };

  // Get current location from browser
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      return alert('Geolocation not supported');
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      (err) => {
        console.error(err);
        alert('Unable to fetch current location');
      }
    );
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar
        onNavigate={(path) => {
          // Navigate to ShopkeeperDashboard if Products clicked
          if (path === 'products') navigate('/shopkeeper/dashboard');
        }}
      />

      {/* Main Content */}
      <div className="p-6 flex-1 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Share Your Location</h2>
        <p className="mb-4 text-gray-600">
          Share your store location with customers to help them find you easily
        </p>

        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Store Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input"
            />
            <div className="flex gap-4">
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                className="input flex-1"
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                className="input flex-1"
              />
            </div>
            <input
              type="text"
              placeholder="Nearby Landmark"
              value={formData.landmark}
              onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              className="input"
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="input"
            />
            <div className="flex gap-4">
              <button type="button" onClick={getCurrentLocation} className="btn-outline">
                📍 Get Current Location
              </button>
              <button type="submit" className="btn-primary">
                🚀 Update Location
              </button>
            </div>
          </form>

          {/* Preview */}
          <div className="preview-card">
            <h3 className="font-bold text-lg">📍 {formData.address}</h3>
            <p>{formData.landmark}</p>
            <div className="mt-2 text-sm">
              <p>
                <strong>Coordinates:</strong> {formData.latitude} , {formData.longitude}
              </p>
              <p>
                <strong>Contact:</strong> {formData.contact}
              </p>
            </div>
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  `https://maps.google.com/?q=${formData.latitude},${formData.longitude}`
                )
              }
              className="btn-outline mt-2"
            >
              Copy Google Maps Link
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Store Location on Map</h3>
          {(!formData.latitude || !formData.longitude) ? (
            <div className="h-72 flex items-center justify-center bg-gradient-to-r from-blue-100 to-green-100 rounded-lg">
              <p>
                Interactive map will be displayed here
                <br />
                Showing your store location to customers
              </p>
            </div>
          ) : (
            <MapContainer
              center={[parseFloat(formData.latitude), parseFloat(formData.longitude)]}
              zoom={16}
              style={{ height: '300px', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[parseFloat(formData.latitude), parseFloat(formData.longitude)]}
              >
                <Popup>{formData.address}</Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareLocation;
