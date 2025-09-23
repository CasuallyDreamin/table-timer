import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/History.css";

function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export default function FullHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 50;

  const fetchHistory = async (currentPage) => {
    if (!window.electron) return;

    try {
      const offset = (currentPage - 1) * pageSize;
      const data = await window.electron.getRecentSessions({ limit: pageSize, offset });
      setHistory(data.rows || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch full history:", err);
      setHistory([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="history">
      <button className="back-btn" onClick={() => navigate("/")}>← Back to Dashboard</button>
      <h2>Full History</h2>

      {history.length === 0 ? (
        <p className="empty">No history to display.</p>
      ) : (
        <>
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
                  <td>{formatTime(h.duration)}</td>
                  <td>{h.ended_at}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
