import React from "react";
import "@fontsource/comic-neue"; // 👈 Fancy cartoon font

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BouncyLetters from "./pages/BouncyLetters";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/bouncy" />} />
        <Route path="/bouncy" element={<BouncyLetters />} />
      </Routes>
    </Router>
  );
}

export default App; // ✅ keep ONLY this line at the bottom
