const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const port = 3000;

// Handlebars als View-Engine einrichten
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Verzeichnis für die Views festlegen
app.set('views', './views');

app.get('/time', (req, res) => {
  const currentTime = new Date().toLocaleTimeString('de-DE');
  res.render('time', { currentTime: currentTime });
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
