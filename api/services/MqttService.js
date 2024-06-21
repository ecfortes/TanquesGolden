const mqtt = require('mqtt');

let collectedData // Armazena dado coletado

const mqttUrl = 'mqtt://35.231.149.126'; // URL do broker MQTT
const client = mqtt.connect(mqttUrl);

client.on('error', () => {
    console.log("Erro de conexao - Verifique seu broker")
})


client.on('connect', () => {
    console.log('Conectado ao broker MQTT');
    client.subscribe('golden/tanks', (err) => {
        console.log('Aguardando msgs');
        if (err) {
            console.error('Erro ao se inscrever no tópico:', err);
        }
    });
});

client.on('message', (topic, message) => {
    const data = message.toString();
    console.log(`Mensagem recebida no tópico ${topic}: ${data}`);
    collectedData = data; // Adiciona a mensagem ao array de dados
});

const connectMqtt = () => client;

const getCollectedData = () => collectedData;

module.exports = {
    connectMqtt,
    getCollectedData,
};
