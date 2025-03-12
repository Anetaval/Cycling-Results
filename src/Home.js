import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import eventList from './data/list.json';

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  // ✅ Načti seznam eventů z list.json
  useEffect(() => {
    const data = eventList;
    setEvents(data);
    // Vyber nejnovější rok automaticky
    const years = [...new Set(data.map((event) => event.year))].sort((a, b) => b - a);
    setSelectedYear(years[0]);
  }, []); // KONEC useEffect, žádný catch!

  const uniqueYears = [...new Set(events.map((event) => event.year))].sort((a, b) => b - a);

  return (
    <div className="home-container">
      {/* 🔝 Horní lišta */}
      <div className="header">Hello, Cycling World! 🚴</div>

      {/* 📅 Lišta s roky */}
      <div className="year-buttons">
        {uniqueYears.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`button ${year === selectedYear ? "active" : ""}`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* 📅 Seznam eventů */}
      <div className="events-container">
        {events
          .filter((event) => event.year === selectedYear)
          .map((event, index) => (
            <div
              key={index}
              className="event-card"
              onClick={() => navigate(`/event/${event.file.replace('.json', '')}`)}
            >
              <span className="event-name">{event.name}</span> - {event.date}
            </div>
          ))}
      </div>

      {/* 🔻 Spodní lišta */}
      <div className="footer">❤️ Enjoy your ride! ❤️ </div>
    </div>
  );
};

export default Home;
