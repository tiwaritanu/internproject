import './FindProduct.css';
import { Link } from 'react-router-dom';
import React, { useState } from "react";
import axios from "axios";

const allProducts = [
  'Headphones', 'Running Shoes', 'Coffee Beans', 'Books', 'Bluetooth Speaker',
  'Organic Tea', 'Yoga Mat', 'Basketball', 'T-Shirts', 'Microwave', 'Table Lamp'
];
const categories = [
  'Electronics', 'Fashion', 'Home & Garden', 'Sports',
  'Books', 'Health', 'Toys', 'Groceries', 'Fitness', 'Beauty', 'Gadgets', 'Kitchen'
];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProductsBySearch = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/products/search/all?search=${query}`);
      setFetchedProducts(res.data);
    } catch (err) {
      console.error("Error fetching products by search:", err);
      setFetchedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (category) => {
    setSearchTerm(category);
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/products/search/all?search=${category}`);
      setFetchedProducts(res.data);
    } catch (err) {
      console.error("Error fetching products by category:", err);
      setFetchedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      const matches = allProducts.filter(item =>
        item.toLowerCase().includes(term.toLowerCase())
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    fetchProductsBySearch(suggestion);
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      setSearchHistory(prev => [...new Set([searchTerm, ...prev])]);
      fetchProductsBySearch(searchTerm);
    }
    setSuggestions([]);
  };

  const toggleCategoryView = () => {
    setShowAllCategories(prev => !prev);
  };

  const handleBrowseAllShops = () => {
    window.location.href = '/shops';
  };

  const handleGetLocation = (productName) => {
    alert(`Fetching location for ${productName}...`);
  };

  const handleChat = (shopName) => {
    alert(`Opening chat with ${shopName || 'shop'}...`);
  };

  return (
    <div className="homepage">
      <main className="homepage-main">
        <h2>Find Products Near You</h2>
        <p>Search for any product and discover local shops that have it available right now.</p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="What are you looking for?"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button onClick={handleSearchSubmit}>Search</button>
        </div>

        {suggestions.length > 0 && (
          <ul className="suggestion-box">
            {suggestions.map((item, index) => (
              <li key={index} onClick={() => handleSuggestionClick(item)}>
                {item}
              </li>
            ))}
          </ul>
        )}

        {searchHistory.length > 0 && (
          <div className="search-history">
            <h4>Recent Searches</h4>
            <div className="history-tags">
              {searchHistory.map((term, index) => (
                <span key={index} onClick={() => {
                  setSearchTerm(term);
                  fetchProductsBySearch(term);
                }}>{term}</span>
              ))}
            </div>
          </div>
        )}

        <p className="popular-searches">
          Popular searches: Headphones, Running Shoes, Coffee Beans, Books
        </p>

        {loading && <p>Loading products...</p>}

        {fetchedProducts.length > 0 && (
          <div className="fetched-products">
            <h4>Search Results:</h4>
            <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {fetchedProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow p-4 flex flex-col items-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="rounded-lg w-full h-40 object-cover mb-4"
                  />
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className="text-gray-500">{product.description}</p>
                  <p className="font-bold mt-2">Price: ${product.price}</p>
                  <p className="font-bold">Stock: {product.stockQuantity}</p>
                  <p className="font-bold">
                    Shop: {product.shopname ? product.shopname : "N/A"}
                  </p>
                  <div
                    className={`mt-2 px-3 py-1 rounded-lg text-sm font-medium ${
                      product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.available ? 'In Stock' : 'Out of Stock'}
                  </div>

                  {/* Get Location Button */}
                  <button
                    className="mt-3 px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition"
                    onClick={() => handleGetLocation(product.name)}
                  >
                    Get Location
                  </button>

                  {/* Chat Button */}
                  <button
                    className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    onClick={() => handleChat(product.shopname)}
                  >
                    Chat
                  </button>

                  {product.shopId && (
                    <Link
                      to={`/shops/${product.shopId}`}
                      className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      View Shop
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {suggestions.length === 0 && searchTerm && fetchedProducts.length === 0 && !loading && (
          <div className="no-results">
            <p>No products found for "{searchTerm}".</p>
            <button onClick={handleBrowseAllShops} className="browse-button">
              Browse All Shops
            </button>
          </div>
        )}

        <section className="categories">
          <h3>Browse by Category</h3>
          <div className={`category-grid ${showAllCategories ? 'expanded' : ''}`}>
            {(showAllCategories ? categories : categories.slice(0, 8)).map((cat) => (
              <div
                key={cat}
                className="category-card"
                onClick={() => fetchProductsByCategory(cat)}
                style={{ cursor: "pointer" }}
              >
                <div className="circle">{cat.charAt(0)}</div>
                <p>{cat}</p>
              </div>
            ))}
          </div>
          {categories.length > 8 && (
            <button onClick={toggleCategoryView} className="see-all-btn">
              {showAllCategories ? 'See Less' : 'See All'}
            </button>
          )}
        </section>

        <footer className="footer">
          <div className="footer-container">
            <div className="footer-column">
              <h3 className="brand">WhereToPurchase</h3>
              <p className="tagline">Connecting shoppers with local retailers in real-time.</p>
            </div>
            <div className="footer-column">
              <h4>For Shoppers</h4>
              <ul>
                <li><a href="#">Find Products</a></li>
                <li><a href="#">How It Works</a></li>
                <li><a href="#">Browse Shops</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>For Shopkeepers</h4>
              <ul>
                <li><a href="#">Register Your Shop</a></li>
                <li><a href="#">Merchant Dashboard</a></li>
                <li><a href="#">Pricing</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 WhereToPurchase. All rights reserved.</p>
            <div className="social-icons">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default SearchPage;

