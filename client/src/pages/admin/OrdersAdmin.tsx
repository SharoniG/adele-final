import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./OrdersAdmin.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faPenToSquare,  faTrashCan,  faFloppyDisk,  faXmark,} from "@fortawesome/free-solid-svg-icons";
import AdminSidebar from "./AdminSidebar"
import { toast } from "react-hot-toast";

//אפשר לשים את זה בקובץ של טייפס (טיפוסים) אבל השארתי פה כי אין לי שימוש רב בטייפ הזה
interface OrderItem {
  product: string;
  quantity: number;
}
interface Order {
  _id: string;
  customer: {
    _id: string;
    name: string;
  };
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
  orderedAt: string;
}

const OrdersAdmin = () => {
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<Order["status"]>("pending");

  useEffect(() => {
    console.log(user.role)
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3000/orders/", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error fetching orders");
        const data: Order[] = await res.json();
        setOrders(data); 
      } catch (err) {
        console.error("Error getting orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const editOrder = (order: Order) => {
    setEditingId(order._id); // שומרת את המזהה של ההזמנה כדי לדעת איזה הזמנה עורכים (כי יש טבלה של כמה)
    setNewStatus(order.status);
  };
  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/orders/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        console.error("Error updating order status");
        return;
      }
      const updated: Order = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
      cancelEdit();
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`http://localhost:3000/orders/cancel/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        console.error("Error deleting order");
        return;
      }
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  if (loading) {
    return <p className={styles.loading}>Loading orders...</p>;
  }

  return (
      <div style={{ display: "flex" }}>
      <AdminSidebar />
    <div className={styles.container}>
      <h1 className={styles.heading}>Orders Management</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>#</th>
            <th className={styles.th}>Customer</th>
            <th className={styles.th}>No of items</th>
            <th className={styles.th}>Total</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Created at</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={order._id} className={styles.tr}>
              <td className={styles.td}>{idx + 1}</td>
              <td className={styles.td}>{order.customer.name}</td>
              <td className={styles.td}>
                {order.items.reduce((sum, i) => sum + i.quantity, 0)}
              </td>
              <td className={styles.td}>{order.totalPrice} $</td>
              <td className={styles.td}>
                {editingId === order._id ? (
                  <select
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(e.target.value as Order["status"])
                    }
                    className={styles.select}
                  >
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="shipped">shipped</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                ) : (
                  order.status
                )}
              </td>
              <td className={styles.td}>
                {new Date(order.orderedAt).toLocaleString()}
              </td>
              <td className={styles.td}>
                {editingId === order._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(order._id)}
                      className={styles.button}
                    >
                      <FontAwesomeIcon
                        icon={faFloppyDisk}
                        style={{ color: "#f5a623", marginRight: 6 }}
                      />
                      Save
                    </button>
                    <button onClick={cancelEdit} className={styles.button}>
                      <FontAwesomeIcon
                        icon={faXmark}
                        style={{ color: "#ccc", marginRight: 6 }}
                      />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => editOrder(order)}
                      className={styles.button}
                    >
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        style={{ color: "#f5a623", marginRight: 6 }}
                      />
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className={`${styles.button} ${styles.deleteButton}`}
                    >
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        style={{ color: "#fff", marginRight: 6 }}
                      />
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default OrdersAdmin;