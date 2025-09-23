import "./styles/History.css";

function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export default function History({ history }) {
  if (!history.length) return <p className="empty">No finished sessions yet.</p>;

  return (
    <div className="history">
      <h2>Usage History</h2>
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
    </div>
  );
}
