import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import EventDetail from "./EventDetail";
import DisciplineLive from "./DisciplineLive";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:eventName" element={<EventDetail />} />
        <Route path="/event/:eventName/discipline/:disciplineName" element={<DisciplineLive />} />
      </Routes>
    </Router>
  );
}

export default App;
