import React, { useEffect, useState } from 'react';
import { getCart, setCart } from './cartDb';
import axios from 'axios';

const styles = {
  container: {
    maxWidth: "480px",
    margin: "40px auto",
    padding: "35px",
    background: "#fff",
    boxShadow: "0 8px 32px #e0e7ef",
    borderRadius: "20px",
    textAlign: "center"
  },
  h2: { fontSize: "2rem", marginBottom: 18 },
  summaryItem: { margin: "14px 0" },
  orderBtn: {
    marginTop: "22px",
    padding: "10px 36px",
    fontSize: "1.1rem",
    background: "#8B5CF6",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer"
  },
  error: {
    color: "#b91c1c",
    fontWeight: "bold",
    fontSize: "1.05rem",
    margin: "16px 0"
  },
  confirm: {
    color: "#16a34a",
    fontWeight: "bold",
    fontSize: "1.3rem",
    marginTop: "16px"
  }
};

function Checkout() {
  const [cart, setCartState] = useState([]);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCart().then(setCartState);
  }, []);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Generate simple transactionId; in real app use uuid
  const transactionId = "txn" + Date.now();

  const placeOrder = async () => {
    setError('');
    try {
      // Prepare backend data format
      const orderData = {
        items: cart.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        userId: "testUser123",  // Or use real user id if you add auth
        status: "pending",
        total: total,
        transactionId: transactionId
      };
      // Make API request
      await axios.post('http://localhost:3000/api/orders', orderData);
      // Success: clear cart everywhere
      setCart([]); // IndexedDB
      setCartState([]); // UI
      setPlaced(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 2000); // Redirect to products page
    } catch (e) {
      setError('Order failed, try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.h2}>Checkout</h2>
      {cart.length === 0 ? (
        <div>No items in cart.</div>
      ) : (
        <div>
          {cart.map(item => (
            <div style={styles.summaryItem} key={item._id}>
              {item.name} x {item.quantity} (₹{item.price * item.quantity})
            </div>
          ))}
          <div style={{ fontWeight: 'bold', margin: '18px 0' }}>
            Grand Total: ₹{total}
          </div>
          {error && <div style={styles.error}>{error}</div>}
          {!placed ? (
            <button style={styles.orderBtn} onClick={placeOrder}>
              Place Order
            </button>
          ) : (
            <div style={styles.confirm}>
              🎉 Order Placed!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Checkout;
