import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import TableCard from "./components/TableCard";
import History from "./components/History";
import FullHistory from "./components/FullHistory";
import "./App.css";

export default function AppWrapper() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/full-history" element={<FullHistory />} />
    </Routes>
  )
}
function Dashboard() {
  const [history, setHistory] = useState([]);
  const [tables, setTables] = useState([]);
  const [newTableName, setNewTableName] = useState("");
  const navigate = useNavigate();

  // Update timers every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTables(tables =>
        tables.map(t =>
          t.state === "running" ? { ...t, time: t.time + 1 } : t
        )
      );
    }, 1000); // 1 minute = 60000 ms

    return () => clearInterval(interval);
  }, []);

  
  useEffect(() => {
    async function fetchHistory() {
      if (!window.electron) return;
      try {
        const recent = await window.electron.getRecentSessions();
        setHistory(recent);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    }
    fetchHistory();
  }, []);

  const getFullHistory = () => {
    navigate("/full-history")
  };

  const startTimer = i =>
    setTables(tables =>
      tables.map((t, index) =>
        i === index ? { ...t, state: "running" } : t
      )
    );

  const pauseTimer = i =>
    setTables(tables =>
      tables.map((t, index) =>
        i === index ? { ...t, state: "paused" } : t
      )
    );

  const endTimer = async i => {
    const table = tables[i];
    if (!table || table.time <= 0) return;

    const session = {
      table_name: table.name,
      duration: table.time,
      ended_at: new Date().toLocaleTimeString()
    };

    // Log session in database
    try {
      if (window.electron) await window.electron.logSession(session);
    } catch (err) {
      console.error("Failed to log session:", err);
    }

    // Remove table first
    setTables(prevTables => prevTables.filter((_, index) => index !== i));

    // Update history safely
    setHistory(prevHistory => {
      const arr = Array.isArray(prevHistory) ? prevHistory : [];
      return [...arr.slice(-99), session];
    });
  };


  const addTable = () => {
    if (!newTableName.trim()) return;
    setTables(prev => [...prev, { name: newTableName.trim(), state: "running", time: 0 }]);
    setNewTableName("");
  };

  const removeTable = i => {
    setTables(tables => tables.filter((_, index) => index !== i));
  };

  return (
    <div className="dashboard">
      <h1>Table Timer Dashboard</h1>

      <header>
        <div className="add-table">
          <input
            type="text"
            value={newTableName}
            placeholder="Enter table name..."
            onChange={e => setNewTableName(e.target.value)}
          />
          <button onClick={addTable}>Add Table</button>
        </div>
        <button onClick={getFullHistory}>Full History</button>
      </header>

      <div className="tables">
        {tables.map((t, i) => (
          <TableCard
            key={i}
            table={t}
            start={() => startTimer(i)}
            pause={() => pauseTimer(i)}
            end={() => endTimer(i)}
          />
        ))}
      </div>

      <History history={history} />
    </div>
  );
}
