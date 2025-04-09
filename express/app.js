const express = require('express');
const app = express();
const port = 3000;

app.get('/time', (req, res) => {
  const currentTime = new Date().toLocaleTimeString('de-DE');
  res.send(`Die aktuelle Uhrzeit ist: ${currentTime}`);
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
