import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Account.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faCalendar, faReceipt } from "@fortawesome/free-solid-svg-icons";

interface User {
  _id: string;
  name: string;
  email: string;
  created: string;
}

interface Order {
  _id: string;
  totalPrice: number;
  status: string;
  orderedAt: string;
}

const Account = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const userSaved = useSelector((state: any) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      const count = Object.keys(userSaved).length;
      if (count === 0 || !userSaved.id) return;
      try {
        const res = await fetch(`http://localhost:3000/users/id/${userSaved.id}`, {
          credentials: "include",
        });
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Error getting user info:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userSaved?.id) return;
      try {
        const res = await fetch(`http://localhost:3000/orders/${userSaved.id}`, {
          credentials: "include",
        });
        const data = await res.json();
       
      setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading orders:", err);
      }
    };
    fetchOrders();
  }, [userSaved]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        <FontAwesomeIcon icon={faUser} style={{ marginRight: "10px" }} />
        My Account
      </h2>

      {user && (
        <div className={styles.section}>
          <h3 className={styles.subheading}>Personal Details</h3>
          <p><FontAwesomeIcon icon={faUser} /> Name:  {user.name}</p>
          <p><FontAwesomeIcon icon={faEnvelope} /> Email:  {user.email}</p>
          <p><FontAwesomeIcon icon={faCalendar} /> Joined:  {new Date(user.created).toLocaleDateString()}</p>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.subheading}>
          <FontAwesomeIcon icon={faReceipt} style={{ marginRight: "6px" }} />
          My Orders
        </h3>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.orderedAt).toLocaleDateString()}</td>
                  <td>{order.totalPrice} $</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Account;