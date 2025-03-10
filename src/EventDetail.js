import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// 🔥 Dynamický import JSON souboru
const loadEventData = (eventName) => {
  try {
    return require(`./events/${eventName.replace(/\s+/g, "-").toLowerCase()}.json`);
  } catch (error) {
    console.error("❌ Event data not found:", eventName);
    return null;
  }
};

const EventDetail = () => {
  const { eventName } = useParams();
  const navigate = useNavigate();
  const eventData = loadEventData(eventName);

  if (!eventData) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">❌ Event data not found</h1>
        <button onClick={() => navigate("/")} className="back-button">
          ⬅️ Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      {/* 🔙 Tlačítko zpět */}
      <button onClick={() => navigate("/")} className="back-button">
        ⬅️ Back to Events
      </button>

      {/* 🏆 Název eventu */}
      <h1 className="event-title">{eventData.name}</h1>
      <p className="event-date">{eventData.date}</p>

      {/* 📄 Event Schedule */}
      {eventData.schedule && (
        <a href={eventData.schedule} target="_blank" rel="noopener noreferrer" className="event-schedule">
          📄 Event Schedule
        </a>
      )}

      {/* 📌 Seznam dnů */}
      {eventData.disciplines.map((day, dayIndex) => (
        <div key={dayIndex} className="event-day">
          <h3
            className="day-title cursor-pointer"
            onClick={() => document.getElementById(`day-${dayIndex}`).classList.toggle("hidden")}
          >
            Day {day.day} - {day.date}
          </h3>

          {/* 📌 Seznam disciplín */}
          <div id={`day-${dayIndex}`} className="hidden disciplines-list">
            {day.events
              .filter(event => !event.hidden)
              .map((event, eventIndex) => (
                <div key={eventIndex} className="discipline-item">
                  {/* 🏁 Klikací název disciplíny → vede na Live Results */}
                  <span
                    className="discipline-name text-blue-500 cursor-pointer underline"
                    onClick={() => navigate(`/event/${eventName}/discipline/${event.name.replace(/\s+/g, "-").toLowerCase()}`)}
                  >
                    {event.listDisplayName || event.name}
                  </span>

                  {/* 📄 PDF tlačítka pro StartList & Results */}
                  <div className="discipline-links">
                    {event.startList && (
                      <a href={event.startList} target="_blank" rel="noopener noreferrer" className="discipline-link">
                        📂 StartList
                      </a>
                    )}
                    {event.results && (
                      <a href={event.results} target="_blank" rel="noopener noreferrer" className="discipline-link">
                        🏆 Results
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventDetail;
