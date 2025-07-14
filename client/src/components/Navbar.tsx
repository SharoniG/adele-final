import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { logoutUser, clearCart, setUser } from "../../redux/store";
import styles from "./Navbar.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShoppingCart, faUnlock } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

function Navbar() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearCart()); // ניקוי עגלה
    dispatch(logoutUser()); // ביצוע לוגאאוט
    dispatch(setUser(null));        //   איפוס משתמש מהרידקס  
    toast("logged out successfully");
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/"><img src="/adele-01.png" alt="Adele Logo" /></Link>
      </div>
      <ul className={styles.navLinks}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        {user?.role === "admin" && (
          <li><Link to="/admin"><FontAwesomeIcon icon={faUnlock} />  Admin Dashboard</Link></li>
        )}
      </ul>

      <div className={styles.userSection}>
        {user ? (
          <>
            <Link to="/cart" className={styles.iconLink}>
              <FontAwesomeIcon icon={faShoppingCart} />
            </Link>
            <div className={styles.user}>
              <Link to="/account" className={styles.iconLink}>
                <FontAwesomeIcon icon={faUser} />
                <span className={styles.username}>{user.name}</span>
              </Link>
            </div>
            <button onClick={handleLogout} className={styles.logoutBtn}>Log Out</button>
          </>
        ) : (
          <Link to="/auth" className={styles.loginBtn}>Login / Sign Up</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;