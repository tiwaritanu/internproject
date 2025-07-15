import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiMessageCircle, FiBox, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './ShopkeeperDashboard.css';

const ShopkeeperDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    stockQuantity: '',
    image: '',
    description: '',
    available: false,
  });
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/products/myproducts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          alert('Session expired, please login again.');
          handleLogout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, [token]);

  const handleAddOrUpdate = () => {
    const token = localStorage.getItem('token');

    if (!form.name || !form.price || !form.category || !form.stockQuantity) {
      alert('Please fill in all required fields.');
      return;
    }

    const url = editingId !== null 
      ? `http://localhost:5000/api/products/${editingId}` 
      : 'http://localhost:5000/api/products';
    const method = editingId !== null ? 'PUT' : 'POST';

    const payload = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      stockQuantity: Number(form.stockQuantity),
      available: Boolean(form.available),
      ...(form.image && { image: form.image }),
      ...(form.description && { description: form.description }),
    };

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (res.status === 401) {
          alert('Session expired, please login again.');
          handleLogout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) return res.text().then(text => { throw new Error(text || (editingId !== null ? 'Update failed' : 'Add failed')); });
        return res.json();
      })
      .then(product => {
        if (editingId !== null) {
          setProducts(prev => prev.map(p => (p._id === editingId ? product : p)));
          alert('Product updated!');
        } else {
          setProducts(prev => [...prev, product]);
          alert('Product added!');
        }
        resetForm();
      })
      .catch(err => {
        console.error(err);
        alert(`Failed to ${editingId !== null ? 'update' : 'add'} product: ${err.message}`);
      });
  };

  const handleEdit = (id) => {
    const product = products.find(p => p._id === id);
    if (!product) return;
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      stockQuantity: product.stockQuantity,
      image: product.image || '',
      description: product.description || '',
      available: product.available || false,
    });
    setEditingId(id);
    setShowModal(true);
  };

  const toggleAvailable = (id) => {
    const product = products.find(p => p._id === id);
    if (!product) return;
    const updated = { ...product, available: !product.available };
    fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updated),
    })
      .then(res => {
        if (res.status === 401) {
          alert('Session expired, please login again.');
          handleLogout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) throw new Error('Toggle available failed');
        return res.json();
      })
      .then(updatedProduct => {
        setProducts(prev => prev.map(p => (p._id === id ? updatedProduct : p)));
      })
      .catch(err => {
        console.error('Toggle available failed:', err);
        alert('Failed to toggle availability. Please try again.');
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          alert('Session expired, please login again.');
          handleLogout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) throw new Error('Delete failed');
        setProducts(prev => prev.filter(p => p._id !== id));
      })
      .catch(err => {
        console.error('Delete failed:', err);
        alert('Failed to delete product. Please try again.');
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setForm({
      name: '',
      price: '',
      category: '',
      stockQuantity: '',
      image: '',
      description: '',
      available: false,
    });
    setEditingId(null);
    setShowModal(false);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2 className="logo">Where2Purchase</h2>
        <ul>
          <li className="active"><FiBox /> Products</li>
          <li onClick={() => navigate('/location')} style={{ cursor: 'pointer' }}>
            <FiMapPin /> Location
          </li>
          <li><FiMessageCircle /> Chat</li>
          <li onClick={handleLogout} className="logout-btn" style={{ cursor: 'pointer', marginTop: 'auto', padding: '10px', color: '#fff' }}>
            <FiLogOut /> Logout
          </li>
        </ul>
      </nav>

      <main className="content">
        <header className="topbar">
          <h1>Shopkeeper Dashboard</h1>
          <button className="status">Store Active</button>
        </header>

        <section className="products">
          <div className="products-header">
            <div>
              <h2>Product Management</h2>
              <p>Manage your product inventory</p>
            </div>
            <button className="btn-add" onClick={openAddModal}>
              <FiPlus /> Add Product
            </button>
          </div>

          <div className="product-grid">
            {products.map(product => (
              <div className="card" key={product._id}>
                <div className="card-img">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="img-placeholder">No Image</div>
                  )}
                  <span className={`status-pill ${product.available ? 'available' : 'out'}`}>
                    {product.available ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
                <div className="card-body">
                  <h3>{product.name}</h3>
                  <p className="desc">{product.description}</p>
                  <p className="price">₹{product.price}</p>
                  <p className="category">Category: {product.category}</p>
                </div>
                <div className="card-footer">
                  <div className="footer-item">
                    <label>Stock:</label>
                    <input type="number" value={product.stockQuantity} readOnly />
                  </div>
                  <div className="footer-item">
                    <label>Available:</label>
                    <input
                      type="checkbox"
                      checked={product.available}
                      onChange={() => toggleAvailable(product._id)}
                    />
                  </div>
                  <div className="actions">
                    <FiEdit2 onClick={() => handleEdit(product._id)} />
                    <FiTrash2 onClick={() => handleDelete(product._id)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {showModal && (
          <div className="modal-backdrop">
            <div className="modal-box">
              <h3>{editingId !== null ? 'Edit Product' : 'Add New Product'}</h3>
              <div className="modal-form">
                <label>Product Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />
                <label>Price (₹) *</label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                />
                <label>Category *</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g., Dairy, Bakery, Groceries"
                />
                <label>Stock Quantity *</label>
                <input
                  name="stockQuantity"
                  type="number"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  placeholder="Enter stock quantity"
                />
                <label>Product Image URL</label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="Enter image URL (optional)"
                />
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Product description"
                />
                <label>
                  <input
                    name="available"
                    type="checkbox"
                    checked={form.available}
                    onChange={handleChange}
                  />{' '}
                  Available
                </label>
                <div className="modal-actions">
                  <button onClick={handleAddOrUpdate}>
                    {editingId !== null ? 'Update' : 'Add'}
                  </button>
                  <button className="btn-cancel" onClick={resetForm}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShopkeeperDashboard;
