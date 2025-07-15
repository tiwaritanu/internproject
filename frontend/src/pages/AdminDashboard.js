import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [sellers, setSellers] = useState([]);

  const fetchSellers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/seller/waiting');
      const data = await response.json();
      setSellers(data);
    } catch (err) {
      console.error('Error fetching sellers:', err);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleAccept = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/seller/accept/${id}`, {
        method: 'POST',
      });
      if (response.ok) {
        alert('Seller approved!');
        fetchSellers();
      }
    } catch (err) {
      console.error('Error accepting seller:', err);
    }
  };

  const handleDecline = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/seller/decline/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Seller declined!');
        fetchSellers();
      }
    } catch (err) {
      console.error('Error declining seller:', err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Pending Seller Requests</h1>
      {sellers.length === 0 ? (
        <p>No sellers found in waiting list.</p>
      ) : (
        sellers.map((seller, index) => (
          <div key={index} className="seller-card">
            <p><strong>Name:</strong> {seller.fullName}</p>
            <p><strong>Email:</strong> {seller.email}</p>
            <p><strong>Shop Name:</strong> {seller.shopName}</p>

            <div className="file-preview">
              <p><strong>Uploaded Files:</strong></p>
              {seller.uploadedFiles && seller.uploadedFiles.length > 0 ? (
                seller.uploadedFiles.map((file, i) => {
                  const isImage = file.match(/\.(jpeg|jpg|png|gif)$/i);
                  const fileUrl = `http://localhost:5000/${file}`;

                  return (
                    <div key={i} className="file-item">
                      {isImage ? (
                        <img src={fileUrl} alt={`Upload ${i + 1}`} />
                      ) : (
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                          View File {i + 1}
                        </a>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>No files uploaded.</p>
              )}
            </div>

            <div className="button-group">
              <button onClick={() => handleAccept(seller._id)}>Accept</button>
              <button onClick={() => handleDecline(seller._id)}>Decline</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
