import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLogin() {
    if (email === "" || password === "") {
      setError("Please fill all fields");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/admin/dashboard");
      })
      .catch(() => {
        setError("Invalid email or password");
      });
  }

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Admin Login 🔒</h2>
      <p>Only authorized admins can login</p>

      <div style={{ marginBottom: "15px" }}>
        <label>Email</label><br />
        <input
          type="email"
          placeholder="Enter admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Password</label><br />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={handleLogin}
        style={{ width: "100%", padding: "10px", background: "#1B4FD8", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Login →
      </button>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        <a href="/">← Back to Voter Login</a>
      </p>
    </div>
  );
}

export default AdminLogin;