require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const devicesRouter = require("./routes/devices.js");
const initWebSocket = require("./websocket/server.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const broadcast = initWebSocket(server);

app.locals.broadcast = broadcast;

app.use("/api/devices", devicesRouter);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
