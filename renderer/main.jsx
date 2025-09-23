import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.jsx'
import FullHistory from "./components/FullHistory.jsx";

import './index.css'

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/full-history" element={<FullHistory />} />
    </Routes>
  </BrowserRouter>
);