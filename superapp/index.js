import express from 'express';
import { engine } from 'express-handlebars';

const app = express();
const port = 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.set('views', './views');

app.get('/time', (req, res) => {

    const name = req.query.name ?? "unbekannt";

    const currentTime = new Date().toLocaleTimeString("de-DE");
    res.render('time', { currentTime: currentTime, name: name });
});

app.get("/wetter", async (req, response) => {

    const data = await fetch("https://wttr.in/Kornwestheim?format=j1")
        .then((res) => res.json());
    const text = data.current_condition[0].weatherDesc.map(v => v.value).join(", ");
    const temp = data.current_condition[0].temp_C;
      
    response.render("weather", {
        text: text,
        temp: temp
    });

})

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
