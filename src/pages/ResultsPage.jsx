import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

function ResultsPage() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchElections();
  }, []);

  async function fetchElections() {
    const snapshot = await getDocs(collection(db, "elections"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setElections(list);
  }

  function handleSelectElection(election) {
    setSelectedElection(election);
    const unsubscribe = onSnapshot(
      collection(db, "elections", election.id, "candidates"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        list.sort((a, b) => b.votes - a.votes);
        setCandidates(list);
      }
    );
    return unsubscribe;
  }

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "20px" }}>
      <h2>Election Results 📊</h2>

      {!selectedElection ? (
        <div>
          <h3>Select Election:</h3>
          {elections.length === 0 && <p>No elections found.</p>}
          {elections.map((e) => (
            <div
              key={e.id}
              onClick={() => handleSelectElection(e)}
              style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "10px", cursor: "pointer" }}
            >
              <strong>{e.name}</strong><br />
              <small>{e.constituency} — {e.status === "active" ? "🟢 Voting Live" : "🔴 Closed"}</small>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3>{selectedElection.name}</h3>
          <p style={{ color: "#666" }}>Constituency: {selectedElection.constituency}</p>

          {selectedElection.status === "active" ? (
            <p style={{ background: "#FFF3CD", padding: "10px", borderRadius: "5px", color: "#856404" }}>
              ⏳ Results will be visible after election closes
            </p>
          ) : (
            <div>
              <p style={{ color: "#666", marginBottom: "15px" }}>Total Votes: <strong>{totalVotes}</strong></p>
              {candidates.map((c, index) => {
                const percent = totalVotes === 0 ? 0 : Math.round((c.votes / totalVotes) * 100);
                return (
                  <div key={c.id} style={{ marginBottom: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>
                        {index === 0 ? "🏆 " : ""}<strong>{c.name}</strong> — {c.party}
                      </span>
                      <span>{percent}%</span>
                    </div>
                    <div style={{ background: "#eee", borderRadius: "5px", height: "10px", marginTop: "5px" }}>
                      <div style={{ width: `${percent}%`, background: "#1B4FD8", height: "10px", borderRadius: "5px" }}></div>
                    </div>
                    <small style={{ color: "#666" }}>{c.votes} votes</small>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={() => { setSelectedElection(null); setCandidates([]); }}
            style={{ padding: "10px 20px", background: "white", color: "#1B4FD8", border: "1px solid #1B4FD8", borderRadius: "5px", cursor: "pointer", marginTop: "15px" }}
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

export default ResultsPage;