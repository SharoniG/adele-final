import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./Admin.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faUsers, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const Admin = () => {
  const user = useSelector((state: any) => state.user);

  if (!user || user.role !== "admin") {
    return (
      <div className={styles.noAccess}>
        <h2> Onyl admins can access this data.</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <div className={styles.cardGrid}>
        <Link to="/admin/orders" className={styles.card}>
          <FontAwesomeIcon icon={faBoxOpen} className={styles.icon} />
          <span>Orders Management</span>
        </Link>
        <Link to="/admin/products" className={styles.card}>
          <FontAwesomeIcon icon={faShoppingCart} className={styles.icon} />
          <span>Products Management</span>
        </Link>
        <Link to="/admin/users" className={styles.card}>
          <FontAwesomeIcon icon={faUsers} className={styles.icon} />
          <span>Users Management</span>
        </Link>
      </div>
    </div>
  );
};

export default Admin;