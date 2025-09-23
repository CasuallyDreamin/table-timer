import "./styles/TableCard.css";

function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export default function TableCard({ table, start, pause, end }) {
  return (
    <div className={`card ${table.state}`}>
      <h2>{table.name}</h2>
      <p className="time">{table.time}</p>
      <div className="buttons">
        <button onClick={start}>Start</button>
        <button onClick={pause}>Pause</button>
        <button onClick={end}>End</button>
      </div>
    </div>
  );
}
