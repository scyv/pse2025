import express from 'express';
import { engine } from 'express-handlebars';

const app = express();
const port = 3000;

// Handlebars als View-Engine einrichten
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Verzeichnis für die Views festlegen
app.set('views', './views');

app.get('/time', (req, res) => {
  const currentTime = new Date().toLocaleTimeString('de-DE');
  res.render('time', { currentTime: currentTime });
});

app.get("/wetter", (res, req) => {

  fetch("https://wttr.in/Kornwestheim?format=j1")
  .then((res)=> res.json())
  .then((data)=>
    {
     const text = data.current_condition.lang_de.map(v => v.value).join(", ");
     const temp = data.current_condition.temp_C;
      res.render("weather", {
        text: text,
        temp: temp
      });
    
    })
  .catch((err)=>{
      console.log("error occured", err)
  });

})

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
