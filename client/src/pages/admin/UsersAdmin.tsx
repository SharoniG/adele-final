import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./UsersAdmin.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faPenToSquare,  faTrashCan,  faFloppyDisk,  faXmark, faPlus} from "@fortawesome/free-solid-svg-icons";
import AdminSidebar from "./AdminSidebar"

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const UsersAdmin = () => {
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<AdminUser>>({}); // מאםשר לערוך חלק מהשדות

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/users", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error fetching users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error getting users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, navigate]);

  const startEdit = (u: AdminUser) => {
    setEditingId(u._id);
    setEditForm({ name: u.name, email: u.email, role: u.role });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/users/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });
      if (!res.ok) return console.error("Error updating user");
      const updated: AdminUser = await res.json();
      setUsers(prev => prev.map(u => (u._id === id ? updated : u)));
      cancelEdit();
    } catch (err) {
      console.error("Cannot update user:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:3000/users/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) return console.error("Error deleting user");
      setUsers(prev => prev.filter(u => u._id !== id)); // מחיקת היוזר עם המזהה שנשלח בבקשה
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  if (loading) return <p className={styles.loading}>Loading users...</p>;

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div className={styles.container}>
        <h1 className={styles.heading}>User Management</h1>

        <button
          className={styles.addButton}
          onClick={() => navigate("/admin/users/new")}
        >
          <FontAwesomeIcon icon={faPlus} /> Add New User
        </button>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Role</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className={styles.tr}>
                {editingId === u._id ? (
                  <>
                    <td className={styles.td}>
                      <input
                        className={styles.input}
                        value={editForm.name || ""}
                        onChange={e =>
                          setEditForm(f => ({ ...f, name: e.target.value }))
                        }
                      />
                    </td>
                    <td className={styles.td}>
                      <input
                        type="email"
                        className={styles.input}
                        value={editForm.email || ""}
                        onChange={e =>
                          setEditForm(f => ({ ...f, email: e.target.value }))
                        }
                      />
                    </td>
                    <td className={styles.td}>
                      <select
                        className={styles.select}
                        value={editForm.role || "user"}
                        onChange={e =>
                          setEditForm(f => ({ ...f, role: e.target.value }))
                        }
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className={styles.td}>
                      <button
                        onClick={() => saveEdit(u._id)}
                        className={styles.button}
                      >
                        <FontAwesomeIcon
                          icon={faFloppyDisk}
                          style={{ color: "#f5a623", marginRight: 6 }}
                        />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className={styles.button}
                      >
                        <FontAwesomeIcon
                          icon={faXmark}
                          style={{ color: "#ccc", marginRight: 6 }}
                        />
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className={styles.td}>{u.name}</td>
                    <td className={styles.td}>{u.email}</td>
                    <td className={styles.td}>{u.role}</td>
                    <td className={styles.td}>
                      <button
                        onClick={() => startEdit(u)}
                        className={styles.button}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          style={{ color: "#f5a623", marginRight: 6 }}
                        />
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className={`${styles.button} ${styles.deleteButton}`}
                      >
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          style={{ color: "#fff", marginRight: 6 }}
                        />
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersAdmin;