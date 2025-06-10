import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "1rem", background: "#eee" }}>
      <ul style={{ listStyle: "none", display: "flex", gap: "1rem" }}>
        <li><Link to="/">בית</Link></li>
        <li><Link to="/products">מוצרים</Link></li>
        <li><Link to="/cart">סל קניות</Link></li>
        <li><Link to="/login">התחברות</Link></li>
        <li><Link to="/register">הרשמה</Link></li>
        <li><Link to="/admin">אדמין</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
