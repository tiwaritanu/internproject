import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ShopsPage.css';

const ShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/shops');
        const data = await response.json();
        setShops(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shops:', error);
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  return (
    <div className="shops-page">
      <h1>Discover Local Shops</h1>
      <p>Browse and connect with the best local retailers in your area.</p>

      <input type="text" placeholder="Search for shops..." className="search-input" />

      <div className="shops-container">
        {loading ? (
          <p>Loading shops...</p>
        ) : shops.length === 0 ? (
          <p>No shops available yet.</p>
        ) : (
          shops.map((shop) => (
            <div className="shop-card" key={shop._id}>
              <img
                src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(shop.shopName)}`}
                alt={shop.shopName}
              />
              <div className="shop-info">
                <h3>{shop.shopName}</h3>
                <p className="category">
                  {Array.isArray(shop.shopCategory)
                    ? shop.shopCategory.join(', ')
                    : shop.shopCategory}
                </p>
                <p>{shop.shopAddress}</p>
                <p>{shop.shopDescription}</p>
                <p><strong>Contact:</strong> {shop.shopPhone}</p>
                <div className="shop-actions">
                  <button className="chat-btn">💬 Chat</button>
                  <Link to={`/shop/${shop._id}/products`}>
                    <button className="view-btn">View Shop</button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShopsPage;
