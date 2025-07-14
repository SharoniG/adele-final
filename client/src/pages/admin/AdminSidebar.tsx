//ניווט צד בדפי מערכת
import { NavLink } from "react-router-dom";
import styles from "./AdminSidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faBoxOpen,  faUsers, faShoppingCart,} from "@fortawesome/free-solid-svg-icons";

const AdminSidebar = () => {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Admin dashboard</h2>
      <NavLink to="/admin/orders" className={styles.link}>
        <FontAwesomeIcon icon={faBoxOpen} className={styles.icon} />
        Orders
      </NavLink>
      <NavLink to="/admin/products" className={styles.link}>
        <FontAwesomeIcon icon={faShoppingCart} className={styles.icon} />
        Products
      </NavLink>
      <NavLink to="/admin/users" className={styles.link}>
        <FontAwesomeIcon icon={faUsers} className={styles.icon} />
        Users
      </NavLink>
    </div>
  );
};

export default AdminSidebar;