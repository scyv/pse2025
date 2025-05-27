import * as readline from 'node:readline/promises';
import mqtt from "mqtt";
import {stdin as input, stdout as output} from 'node:process';

const client = mqtt.connect("mqtt://test.mosquitto.org");

client.on("connect", () => {
    const askQuestion = async () => {
        const rl = readline.createInterface({input, output});
        const answer = await rl.question('Nachricht: ');
        client.publish("psekwh/message", answer);
        rl.close();
        askQuestion();
    };

    askQuestion();
});


