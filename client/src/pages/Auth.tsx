import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/store.tsx";
import styles from "./Auth.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser, faUserTag } from "@fortawesome/free-solid-svg-icons";

function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = isRegister // לפי סוג הטופס הבקשה נשלחת לאנדפוינט של התחברות או יצירת יוזר חדש
      ? "http://localhost:3000/users/register"
      : "http://localhost:3000/users/login";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      const expiresAt = Date.now() + 1000 * 60 * 60; // תוקף של שעה אחת
      const userWithExpiry = { ...data.user, expiresAt };

      if (res.ok) {
         dispatch(setUser(userWithExpiry)); // שומרת ברידקס כדי לבדוק בעת טעינה אם עברה שעה  שזה הזמן שהגדרתי כשימרת טוקן
        localStorage.setItem("user", JSON.stringify(userWithExpiry));//שמירת ללוקאל
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>{isRegister ? "Sign Up" : "Login"}</h2> 

        {isRegister && (
          <>
            <div className={styles.inputGroup}>
              <FontAwesomeIcon icon={faUser} className={styles.icon} />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
          
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Pick Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </>
        )}

        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faLock} className={styles.icon} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          {isRegister ? "Create Account" : "Login"}
        </button>

        <p className={styles.toggleText}>
          {isRegister ? "Already have an account?" : "No account?"}
          <button type="button" onClick={() => setIsRegister(!isRegister)} className={styles.toggleButton}>
            {isRegister ? "Login" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Auth;