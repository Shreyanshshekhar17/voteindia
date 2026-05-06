import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

function AdminDashboard() {
  const [electionName, setElectionName] = useState("");
  const [constituency, setConstituency] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateParty, setCandidateParty] = useState("");
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchElections();
  }, []);

  async function fetchElections() {
    const snapshot = await getDocs(collection(db, "elections"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setElections(list);
  }

  async function createElection() {
    if (electionName === "" || constituency === "") {
      setMessage("Please fill election name and constituency");
      return;
    }
    await addDoc(collection(db, "elections"), {
      name: electionName,
      constituency: constituency,
      status: "active",
    });
    setMessage("Election created successfully!");
    setElectionName("");
    setConstituency("");
    fetchElections();
  }

  async function addCandidate() {
    if (selectedElection === "" || candidateName === "" || candidateParty === "") {
      setMessage("Please fill all candidate details");
      return;
    }
    await addDoc(collection(db, "elections", selectedElection, "candidates"), {
      name: candidateName,
      party: candidateParty,
      votes: 0,
    });
    setMessage("Candidate added successfully!");
    setCandidateName("");
    setCandidateParty("");
  }

  async function closeElection(electionId) {
    await updateDoc(doc(db, "elections", electionId), {
      status: "closed",
    });
    setMessage("Election closed! Results are now visible.");
    fetchElections();
  }

  function handleLogout() {
    signOut(auth);
    navigate("/admin");
  }

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Admin Dashboard 🗳️</h2>
        <button onClick={handleLogout} style={{ padding: "8px 15px", background: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      {message && <p style={{ color: "green", border: "1px solid green", padding: "8px", borderRadius: "5px" }}>{message}</p>}

      {/* Election Banao */}
      <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>Create New Election</h3>
        <input
          type="text"
          placeholder="Election Name (e.g. Jharkhand Vidhan Sabha 2024)"
          value={electionName}
          onChange={(e) => setElectionName(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="Constituency (e.g. Koderma)"
          value={constituency}
          onChange={(e) => setConstituency(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button
          onClick={createElection}
          style={{ width: "100%", padding: "10px", background: "#1B4FD8", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Create Election
        </button>
      </div>

      {/* Candidate Add Karo */}
      <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>Add Candidate</h3>
        <select
          value={selectedElection}
          onChange={(e) => setSelectedElection(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        >
          <option value="">Select Election</option>
          {elections.map((e) => (
            <option key={e.id} value={e.id}>{e.name} — {e.constituency}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="Party Name"
          value={candidateParty}
          onChange={(e) => setCandidateParty(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button
          onClick={addCandidate}
          style={{ width: "100%", padding: "10px", background: "#1B4FD8", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Add Candidate
        </button>
      </div>

      {/* Elections List */}
      <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
        <h3>All Elections</h3>
        {elections.length === 0 && <p>No elections yet</p>}
        {elections.map((e) => (
          <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #eee" }}>
            <div>
              <strong>{e.name}</strong><br />
              <small>{e.constituency} — {e.status === "active" ? "🟢 Active" : "🔴 Closed"}</small>
            </div>
            {e.status === "active" && (
              <button
                onClick={() => closeElection(e.id)}
                style={{ padding: "6px 12px", background: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
              >
                Close Election
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;