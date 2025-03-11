import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFlagUrl } from './Utils/getFlagUrl';

const API_KEY = "AIzaSyAth7L9k8Xmpl9e5GSfeW68N1ThaSp0WAs";

const DisciplineLive = () => {
  const { eventName, disciplineName } = useParams();
  const navigate = useNavigate();

  // 📦 Stavy
  const [eventData, setEventData] = useState(null);
  const [eventDisplayName, setEventDisplayName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [data, setData] = useState([]);
  const [googleSheetsId, setGoogleSheetsId] = useState("");
  const [sheetName, setSheetName] = useState("");
  const [rowRange, setRowRange] = useState([0, 0]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [boldRows, setBoldRows] = useState([]);

  // ✅ Speciální disciplíny
  const omniumDisciplines = ["Omnium ME", "Omnium WE", "Omnium MU19", "Omnium WU19", "Omnium MJ", "Omnium WJ"];
  const isOmnium = omniumDisciplines.includes(displayName);
  const isOmniumMain = isOmnium && displayName === eventDisplayName;

  const madisonDisciplines = ["Madison ME", "Madison WE", "Madison MJ", "Madison WJ"];
  const isMadison = madisonDisciplines.includes(sheetName);

  // ✅ Načtení eventu a disciplíny
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + `/events/list.json`)
      .then((response) => response.json())
      .then((data) => {
        const event = data.find((e) => e.file.replace('.json', '') === eventName);
        if (event) {
          setEventDisplayName(event.name);
          setGoogleSheetsId(event.googleSheetsId);
          fetch(process.env.PUBLIC_URL + `/events/${event.file}`)
            .then((response) => response.json())
            .then((jsonData) => {
              setEventData(jsonData);

              const discipline = jsonData.disciplines
                .flatMap((day) => day.events)
                .find((d) => d.name.replace(/\s+/g, "-").replace(/\//g, "-").toLowerCase() === disciplineName);

              if (discipline) {
                setSheetName(discipline.sheetName);
                setRowRange(discipline.rowRange);
                setSelectedColumns(discipline.columns);
                setRelatedEvents(discipline.relatedEvents || []);
                setDisplayName(discipline.displayName || discipline.name);
                setBoldRows(discipline.boldRows || []);
              }
            });
        }
      })
      .catch((error) => console.error("❌ Chyba při načítání JSON:", error));
  }, [eventName, disciplineName]);

  // ✅ Načtení dat z Google Sheets
  useEffect(() => {
    if (!googleSheetsId || !sheetName || rowRange[0] === 0 || selectedColumns.length === 0) return;
    console.log("📊 Google Sheets ID:", googleSheetsId);
console.log("📊 Sheet name:", sheetName);
console.log("📊 Row range:", rowRange);
console.log("📊 Selected columns:", selectedColumns);

    const fetchDataFromSheets = async () => {
      const range = `${sheetName}!A${rowRange[0]}:Z${rowRange[1]}`;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetsId}/values/${range}?key=${API_KEY}`;
    
      console.log("✅ URL pro Google Sheets:", url);


      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("✅ Data z Google Sheets:", json); // Výsledek API
        if (!data.values) return;

        const columnIndexes = selectedColumns.map((col) => col.charCodeAt(0) - 65);
        const formattedData = data.values.map((row) =>
          columnIndexes.map((index) => (index >= 0 && index < row.length ? row[index] : ""))
        );
        setData(formattedData);
      } catch (error) {
        console.error("❌ Chyba při načítání dat z Google Sheets:", error);
      }
    };
    fetchDataFromSheets();
    const interval = setInterval(fetchDataFromSheets, 30000);
    return () => clearInterval(interval);
  }, [googleSheetsId, sheetName, rowRange, selectedColumns]);

  let currentHeaderRow = [];

  // ✅ Render
  return (
    <div className="p-4 discipline-container">
      <button onClick={() => navigate(`/event/${eventName}`)} className="back-button">
        ⬅️ Back to {eventDisplayName || eventName.replace(/-/g, " ")}
      </button>

      <h1 className="discipline-title">{displayName}</h1>
      <h3 className="discipline-subtitle">Results</h3>

      {relatedEvents.length > 0 && (
        <div className="related-events">
          {relatedEvents.map((relatedEvent, index) => {
            const formattedRelatedEvent = relatedEvent.replace(/\s+/g, "-").replace(/\//g, "-").toLowerCase();
            return (
              <button key={index} className="event-switch-button" onClick={() => navigate(`/event/${eventName}/discipline/${formattedRelatedEvent}`)}>
                {relatedEvent}
              </button>
            );
          })}
        </div>
      )}

      {data.length > 0 ? (
        <table className={`discipline-table ${isOmnium ? "omnium-table" : ""}`}>
          <tbody>
            {isOmnium && (
              <tr className="omnium-second-header">
                <td colSpan={5}></td>
                <td colSpan={2}>Scratch</td>
                <td colSpan={2}>Tempo Race</td>
                <td colSpan={2}>Elimination</td>
                <td>Points Race</td>
                <td></td>
              </tr>
            )}
            {data.map((row, i) => {
              const rowNumber = rowRange[0] + i + 1;
              const isBold = boldRows.includes(rowNumber);
              const isPairEnd = isMadison && (i >= 1) && ((i - 1) % 2 === 1);
              const isSpacerRow = row.every(cell => (cell || "").trim() === "");

              if (isSpacerRow) return <tr key={`spacer-${i}`} className="spacer-row"><td colSpan={selectedColumns.length}></td></tr>;

              const hasFinal = row.some(cell => typeof cell === "string" && cell.trim().toLowerCase().includes("final"));
              const hasRepechage = row.some(cell => typeof cell === "string" && cell.trim().toLowerCase().includes("repechage"));
              const heatPattern = /^(heat (1|2|3|4|5|6))$/i;
              const hasExactHeat = row.some(cell => typeof cell === "string" && heatPattern.test(cell.trim()));

              if (hasFinal || hasRepechage || hasExactHeat) {
                const headerText = row.find(cell => cell && (cell.trim().toLowerCase().includes("final") || cell.trim().toLowerCase().includes("repechage") || heatPattern.test(cell.trim())));
                return <tr key={`final-${i}`} className="final-header-row"><td colSpan={selectedColumns.length} className="final-header-cell">{headerText.trim().toUpperCase()}</td></tr>;
              }

              const isHeaderRow = row.some(cell => typeof cell === "string" && (cell.trim().toLowerCase() === "rnk" || cell.trim().toLowerCase() === "bib"));
              if (isHeaderRow) {
                currentHeaderRow = row;
                return <tr key={`header-${i}`} className="header-row">{row.map((cell, j) => <th key={j}>{cell}</th>)}</tr>;
              }

              return (
                <React.Fragment key={i}>
                  <tr className={`${isBold ? "bold-row" : ""}${isPairEnd ? "madison-pair-border" : ""}`}>
                    {row.map((cell, j) => {
                      const headerCell = currentHeaderRow[j];
                      const isCountryCol = headerCell && ["country", "nat", "nationality"].includes(headerCell.trim().toLowerCase());
                      return isCountryCol ? <td key={j}><img src={getFlagUrl(cell)} alt={cell} className="flag-icon" /></td> : <td key={j}>{cell}</td>;
                    })}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      ) : <p className="no-data">⚠️ Žádná data k zobrazení.</p>}
    </div>
  );
};

export default DisciplineLive;
