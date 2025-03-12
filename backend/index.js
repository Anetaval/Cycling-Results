const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

// ✅ GET /api/events - seznam závodů (list.json)
app.get('/api/events', (req, res) => {
  const listPath = path.join(__dirname, 'data', 'list.json');
  fs.readFile(listPath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Chyba při čtení list.json:', err);
      return res.status(500).json({ error: 'Chyba při čtení seznamu závodů.' });
    }
    res.json(JSON.parse(data));
  });
});

// ✅ GET /api/events/:eventName - detail jednoho závodu
app.get('/api/events/:eventName', (req, res) => {
  const { eventName } = req.params;
  const eventPath = path.join(__dirname, 'data', `${eventName}.json`);

  fs.readFile(eventPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`❌ Chyba při čtení souboru ${eventName}.json:`, err);
      return res.status(404).json({ error: 'Závod nenalezen.' });
    }
    res.json(JSON.parse(data));
  });
});

// ✅ GET /api/google-sheets - bude pro Google Sheets (připravíme později)

app.listen(port, () => {
  console.log(`🚀 Backend běží na portu ${port}`);
});
