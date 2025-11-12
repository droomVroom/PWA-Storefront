import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCart, setCart } from './cartDb';
import ChatBot from './ChatBot';
import { FaMoon, FaSun } from 'react-icons/fa';
import ScrollToTopButton from './ScrollToTopButton';

const styles = {
  header: {
    background: "linear-gradient(90deg, #0ea5e9 60%, #38bdf8)",
    color: "white",
    padding: "22px 32px",
    fontSize: "2.2rem",
    fontWeight: "bold",
    letterSpacing: "1px",
    boxShadow: "0 2px 8px #bee4fa"
  },
  container: {
    display: "flex",
    minHeight: "90vh",
    background: "#F3F4F6"
  },
  productsArea: {
    flex: 3,
    padding: "40px 60px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
    gap: "35px"
  },
  card: {
    background: "white",
    borderRadius: "14px",
    boxShadow: "0 4px 24px #eee",
    padding: "15px",
    transition: "0.2s",
    border: "1.5px solid #f3f3f3",
    position: "relative"
  },
  cardDark: {
    background: "#1e293b",
    color: "#fff",
    border: "1.5px solid #334155",
    boxShadow: "0 4px 24px #02061780"
  },
  image: {
    borderRadius: "10px",
    width: "100%",
    aspectRatio: "4/3",
    objectFit: "cover",
    background: "#f5f5f5"
  },
  prodName: {
    fontWeight: "bold",
    margin: "10px 0 5px 0",
    fontSize: "1.1rem"
  },
  addBtn: {
    background: "#0ea5e9",
    color: "#fff",
    border: "none",
    padding: "8px 18px",
    borderRadius: "20px",
    fontWeight: "bold",
    marginTop: "10px",
    cursor: "pointer",
    transition: "0.13s",
    fontSize: "1rem"
  },
  addBtnDark: {
    background: "#0284c7",
    color: "#fff"
  },
  sideCart: {
    flex: 1,
    background: "#fff",
    boxShadow: "0 2px 12px #e5e7eb",
    borderRadius: "10px",
    padding: "30px",
    margin: "40px 30px 40px 0",
    minWidth: "260px",
    maxWidth: "310px",
    height: "fit-content"
  },
  sideCartDark: {
    background: "#1e293b",
    color: "#fff",
    boxShadow: "0 2px 12px #0284c799"
  },
  cartTitle: {
    fontWeight: "bold",
    fontSize: "1.2rem",
    marginBottom: "10px"
  },
  cartItem: { margin: "10px 0", fontSize: "1.05rem" },
  cartTotal: {
    marginTop: "15px",
    borderTop: "1px dashed #ddd",
    paddingTop: "7px",
    fontWeight: "bold"
  },
  checkoutBtn: {
    marginTop: "15px",
    background: "#0ea5e9",
    color: "white",
    borderRadius: "9px",
    border: "none",
    fontWeight: "bold",
    fontSize: "1.05rem",
    padding: "8px 22px",
    cursor: "pointer"
  },
  checkoutBtnDark: {
    background: "#334155",
    color: "#fff"
  }
};

function Products() {
  const [products, setProducts] = useState([]);
  const [cart, setCartState] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/api/categories')
      .then((res) => setCategories(res.data.map(cat => cat.name)))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    getCart().then(data => setCartState(data));
  }, []);

  useEffect(() => {
    setCart(cart);
  }, [cart]);

  useEffect(() => {
    let url = 'http://localhost:3000/api/products?limit=100';
    if (search) url += `&q=${encodeURIComponent(search)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    axios.get(url)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, [search, category]);

  const addToCart = (product) => {
    setCartState(prevCart => {
      const found = prevCart.find(item => item._id === product._id);
      if (found) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div style={{
      minHeight:'100vh',
      background: darkMode ? "#0f172a" : "#F3F4F6",
      color: darkMode ? "#bae6fd" : "#222"
    }}>
      <div style={{
        ...styles.header,
        background: darkMode
          ? "linear-gradient(90deg, #334155 60%, #0ea5e9 100%)"
          : styles.header.background,
        color: darkMode ? "#bae6fd" : styles.header.color
      }}>
        <span role="img" aria-label="cart" style={{marginRight:10, marginLeft:-4}}>🛒</span>
        SnapCart <span style={{fontWeight:"normal", fontSize:"1.1rem", color:"#bae6fd",marginLeft:8}}>Shop Smarter</span>
        <button
          style={{
            float:"right", marginLeft:28, marginTop:-4, background:"none", border:"none",
            color:darkMode?"#fbbf24":"#fff", fontSize:28, cursor:"pointer"
          }}
          title={darkMode?"Switch to Light":"Switch to Dark"}
          onClick={()=>setDarkMode(x=>!x)}
        >
          {darkMode? <FaSun/> : <FaMoon/>}
        </button>
      </div>
      <div style={styles.container}>
        <div style={styles.productsArea}>
          <h2 style={{ fontSize: "2rem", marginBottom: 18 }}>Products</h2>
          <div style={{ marginBottom: 28, display: 'flex', gap: '20px' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '10px 14px',
                fontSize: '1rem',
                borderRadius: '9px',
                border: darkMode ? '1px solid #313d4e' : '1px solid #ddd',
                minWidth: '200px',
                background: darkMode ? "#1e293b" : "#fff",
                color: darkMode ? "#fff" : "#222"
              }}
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{
                padding: '10px 14px', fontSize: '1rem',
                borderRadius: '9px', border: darkMode ? '1px solid #313d4e' : '1px solid #ddd', minWidth: '180px',
                background: darkMode ? "#1e293b" : "#fff",
                color: darkMode ? "#fff" : "#222"
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat =>
                <option key={cat} value={cat}>{cat}</option>
              )}
            </select>
          </div>
          <div style={styles.grid}>
            {products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              products.map((product) => (
                <div
                  key={product._id}
                  style={{
                    ...styles.card,
                    ...(darkMode ? styles.cardDark : {})
                  }}
                >
                  <img
                    src={product.image ? product.image : "https://via.placeholder.com/150"}
                    alt={product.name}
                    style={styles.image}
                  />
                  <div style={styles.prodName}>{product.name}</div>
                  <div>₹{product.price}</div>
                  <div style={{ fontSize: "0.95rem", color: darkMode ? "#a5f3fc" : "#6b7280" }}>{product.category}</div>
                  <div style={{ fontSize: "0.93rem", marginBottom: 7 }}>{product.description}</div>
                  <button
                    style={{...styles.addBtn, ...(darkMode ? styles.addBtnDark : {})}}
                    onClick={() => addToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        <div style={{...styles.sideCart, ...(darkMode ? styles.sideCartDark : {})}}>
          <div style={styles.cartTitle}>🛍️ Cart</div>
          {cart.length === 0 ? (
            <div style={{ color: darkMode ? "#94a3b8" : "#888", margin: "18px 0" }}>Cart is empty.</div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item._id} style={styles.cartItem}>
                  {item.name} x {item.quantity} <span style={{ color: "#10b981" }}>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div style={styles.cartTotal}>
                Total: ₹{total}
              </div>
              <a href="/checkout">
                <button style={{...styles.checkoutBtn, ...(darkMode ? styles.checkoutBtnDark : {})}}>
                  Checkout
                </button>
              </a>
            </>
          )}
        </div>
      </div>
      <div style={{
        background:darkMode?'#0ea5e9':'#f0f9ff',
        color:darkMode?'#fff':'#0284c7',
        textAlign:'center', fontWeight:'bold',
        padding:'16px 0', marginTop:40, fontSize:"1.05rem",
        letterSpacing:"0.4px", transition:"0.2s"
      }}>
        © 2025 SnapCart · Built for Capstone · Made by Hardik & Sanshray
      </div>
      <ChatBot darkMode={darkMode} setDarkMode={setDarkMode} />
      <ScrollToTopButton darkMode={darkMode}/>
    </div>
  );
}

export default Products;
