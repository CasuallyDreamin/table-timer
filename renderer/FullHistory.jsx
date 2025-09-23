import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./styles/History.css";

function FullHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetch() {
      if (window.electron) {
        const data = await window.electron.getRecentSessions(1000);
        setHistory(data);
      }
    }
    fetch();
  }, []);

  return (
    <div className="history">
      <h2>Full History</h2>
      <table>
        <thead>
          <tr>
            <th>Table Name</th>
            <th>Duration</th>
            <th>Ended At</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, idx) => (
            <tr key={idx}>
              <td>{h.table_name}</td>
              <td>{h.duration}</td>
              <td>{h.ended_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<FullHistory />);
