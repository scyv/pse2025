const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const port = 3000;

// Handlebars als View-Engine einrichten
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/'
}));
app.set('view engine', 'handlebars');

// Verzeichnis für die Views festlegen
app.set('views', __dirname + '/views');

app.get('/time', (req, res) => {
  const currentTime = new Date().toLocaleTimeString('de-DE');
  res.render('time', { currentTime: currentTime });
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
