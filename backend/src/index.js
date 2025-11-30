require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const devicesRouter = require("./routes/devices.js");
const initWebSocket = require("./websocket/server.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use("/api/devices", devicesRouter);

const server = http.createServer(app);

const broadcast = initWebSocket(server);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

setInterval(() => {
  broadcast({ type: "telemetry", value: Math.random() });
}, 2000);
