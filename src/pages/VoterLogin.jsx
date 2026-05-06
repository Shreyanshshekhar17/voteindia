import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VoterLogin() {
  const [epicId, setEpicId] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleVerify() {
    if (epicId === "" || dob === "") {
      setError("Please fill all fields");
      return;
    }

    const epicFormat = /^[A-Z]{3}[0-9]{3}[0-9]{4}$/;
    if (!epicFormat.test(epicId.toUpperCase())) {
      setError("Invalid EPIC ID format. Example: ABC1232026 (3 letters + 3 numbers + 4 year digits)");
      return;
    }

    const year = parseInt(epicId.slice(6, 10));
    const currentYear = new Date().getFullYear();
    if (year < 1950 || year > currentYear) {
      setError("Invalid year in EPIC ID");
      return;
    }

    const dobDate = new Date(dob);
    const dobYear = dobDate.getFullYear();
    const today = new Date();
    if (dobYear < 1950 || dobDate > today) {
      setError("Date of Birth must be between 1950 and today");
      return;
    }

    // Voter ki age kam se kam 18 honi chahiye
    let age = today.getFullYear() - dobYear;
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    if (age < 18) {
      setError("You must be at least 18 years old to vote");
      return;
    }

    navigate("/vote", { state: { epicId: epicId.toUpperCase(), dob } });
  }

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>VoteIndia 🗳️</h2>
      <p>Enter your details to vote</p>

      <div style={{ marginBottom: "15px" }}>
        <label>EPIC ID</label><br />
        <input
          type="text"
          placeholder="Example: ABC1232026"
          value={epicId}
          onChange={(e) => setEpicId(e.target.value)}
          maxLength={10}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
        <small style={{ color: "#666" }}>Format: 3 letters + 3 numbers + 4 year digits</small>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Date of Birth</label><br />
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          min="1950-01-01"
          max={new Date().toISOString().split("T")[0]}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
        <small style={{ color: "#666" }}>Date must be between 1950 and today</small>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={handleVerify}
        style={{ width: "100%", padding: "10px", background: "#1B4FD8", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Verify & Continue →
      </button>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Admin? <a href="/admin">Login here</a>
      </p>
    </div>
  );
}

export default VoterLogin;