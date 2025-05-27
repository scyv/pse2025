import mqtt from "mqtt";
const client = mqtt.connect("mqtt://test.mosquitto.org");

client.on("connect", () => {
    client.subscribe("psekwh/message");
});

client.on("message", (topic, message) => {
    console.log(message.toString());
});

