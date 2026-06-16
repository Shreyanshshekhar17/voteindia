import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";

function VotePage() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [message, setMessage] = useState("");
  const [voted, setVoted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const epicId = location.state?.epicId;

  useEffect(() => {
    if (!epicId) {
      navigate("/");
      return;
    }
    fetchElections();
  }, [epicId, navigate]);

  async function fetchElections() {
    const snapshot = await getDocs(collection(db, "elections"));
    const list = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((e) => e.status === "active");
    setElections(list);
  }

  async function fetchCandidates(electionId) {
    const snapshot = await getDocs(collection(db, "elections", electionId, "candidates"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCandidates(list);
  }

  function handleSelectElection(election) {
    setSelectedElection(election);
    fetchCandidates(election.id);
  }

  async function handleVote() {
    if (selectedCandidate === "") {
      setMessage("Please select a candidate");
      return;
    }

    // epicId hi document ID banega — isse double voting rukegi
    const voteRef = doc(db, "elections", selectedElection.id, "votes", epicId);
    const voteSnap = await getDoc(voteRef);

    if (voteSnap.exists()) {
      setMessage("You have already voted in this election!");
      return;
    }

    // setDoc use karo taaki epicId fixed ID rahe
    await setDoc(voteRef, {
      epicId: epicId,
      candidateId: selectedCandidate,
      timestamp: new Date().toISOString(),
    });

    await updateDoc(doc(db, "elections", selectedElection.id, "candidates", selectedCandidate), {
      votes: increment(1),
    });

    setVoted(true);
    setMessage("Vote cast successfully! Results will be shown after election closes.");
  }

  if (voted) {
    return (
      <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", textAlign: "center", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h2>✅ Vote Cast Successfully!</h2>
        <p>Thank you for voting, your vote has been recorded.</p>
        <p style={{ color: "#666" }}>Results will be visible after the election closes.</p>
        <button
          onClick={() => navigate("/results")}
          style={{ padding: "10px 20px", background: "#1B4FD8", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "15px" }}
        >
          View Results Page
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "20px" }}>
      <h2>Cast Your Vote 🗳️</h2>
      <p style={{ color: "#666" }}>EPIC ID: <strong>{epicId}</strong></p>

      {message && <p style={{ color: "red", border: "1px solid red", padding: "8px", borderRadius: "5px" }}>{message}</p>}

      {!selectedElection ? (
        <div>
          <h3>Select Election:</h3>
          {elections.length === 0 && <p>No active elections right now.</p>}
          {elections.map((e) => (
            <div
              key={e.id}
              onClick={() => handleSelectElection(e)}
              style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "10px", cursor: "pointer" }}
            >
              <strong>{e.name}</strong><br />
              <small>Constituency: {e.constituency}</small>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3>{selectedElection.name}</h3>
          <p style={{ color: "#666" }}>Constituency: {selectedElection.constituency}</p>
          <h4>Select Candidate:</h4>
          {candidates.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCandidate(c.id)}
              style={{
                padding: "15px",
                border: selectedCandidate === c.id ? "2px solid #1B4FD8" : "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "10px",
                cursor: "pointer",
                background: selectedCandidate === c.id ? "#EEF3FF" : "white"
              }}
            >
              <strong>{c.name}</strong><br />
              <small>{c.party}</small>
            </div>
          ))}

          <button
            onClick={handleVote}
            style={{ width: "100%", padding: "10px", background: "#1B4FD8", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}
          >
            Submit Vote →
          </button>

          <button
            onClick={() => { setSelectedElection(null); setCandidates([]); }}
            style={{ width: "100%", padding: "10px", background: "white", color: "#1B4FD8", border: "1px solid #1B4FD8", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}
          >
            ← Back to Elections
          </button>
        </div>
      )}
    </div>
  );
}

export default VotePage;