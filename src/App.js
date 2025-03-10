import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import EventDetail from "./EventDetail"; // Importujeme EventDetail
import DisciplineLive from "./DisciplineLive"; // Přidáme import

function App() {
  return (
    <Router basename="/Cycling-Results">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:eventName" element={<EventDetail />} />
        <Route path="/event/:eventName/discipline/:disciplineName" element={<DisciplineLive />} />
        {/* Další cesty přidáme později */}
      </Routes>
    </Router>
  );
}

export default App;



