import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const eventsByYear = {
  2025: [
    { name: "Mistrovství Evropy", date: "08/2025", hidden: false },
    { name: "Mistrovství ČR", date: "06/2025", hidden: false },
    { name: "GP Framar Praha", date: "05/2025", hidden: false }
  ],
  2024: [
    { name: "GP Brno Sprint", date: "06/2024", hidden: false },
  ],
};

const Home = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(
    Math.max(...Object.keys(eventsByYear).map(Number))
  );

  return (
    <div className="home-container">
      {/* 🔝 Horní lišta */}
      <div className="header">Hello, Cycling World! 🚴</div>

      {/* 📅 Lišta s roky */}
      <div className="year-buttons">
        {Object.keys(eventsByYear)
          .sort((a, b) => b - a)
          .map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(Number(year))}
              className="button"
            >
              {year}
            </button>
          ))}
      </div>

      {/* 📅 Seznam eventů */}
      <div className="events-container">
        {eventsByYear[selectedYear]
          .filter((event) => !event.hidden)
          .map((event, index) => (
            <div
              key={index}
              className="event-card"
              onClick={() => navigate(`/event/${event.name.replace(/\s+/g, "-").toLowerCase()}`)}
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
