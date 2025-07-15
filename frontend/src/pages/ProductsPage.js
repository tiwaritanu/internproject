import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductsPage.css';

const ProductsPage = () => {
  const { shopId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null); // For shop location
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/productshops/${shopId}/products`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [shopId]);

  // Fetch the shop's location from the backend
  const handleGetLocation = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/productshops/${shopId}/location`);
      if (!response.ok) {
        throw new Error('Failed to fetch location details');
      }
      const data = await response.json();
      setLocation(data);
      console.log('Fetched location:', data);
    } catch (error) {
      console.error('Error fetching location:', error);
      alert('Could not fetch location details.');
    }
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="products-page">
      <h1>Products for this Shop</h1>

      <div className="top-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />

        <button className="get-location-btn" onClick={handleGetLocation}>
          Get Location
        </button>
      </div>

      {/* Display shop's location details */}
      {location && (
        <div className="location-info">
          <h3>Shop Location Details:</h3>
          <p><strong>Address:</strong> {location.address}</p>
          <p><strong>Landmark:</strong> {location.landmark}</p>
          <p><strong>Contact:</strong> {location.contact}</p>
          <p><strong>Latitude:</strong> {location.latitude}</p>
          <p><strong>Longitude:</strong> {location.longitude}</p>

          {/* Show Map */}
          <div className="map-container">
            <iframe
              title="Shop Location Map"
              width="100%"
              height="300"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&hl=es;z=14&output=embed`}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products found for this search.</p>
      ) : (
        <div className="products-container">
          {filteredProducts.map((product) => (
            <div className="product-card" key={product._id}>
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Stock:</strong> {product.stockQuantity}</p>
              <p
                className={`availability ${
                  product.available ? 'in-stock' : 'out-of-stock'
                }`}
              >
                {product.available ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
