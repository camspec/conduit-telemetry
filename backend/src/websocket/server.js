const WebSocket = require("ws");

function initWebSocket(server) {
  const wss = new WebSocket.Server({ server });
  const clients = new Set();

  wss.on("connection", (ws) => {
    console.log("Client connected");
    clients.add(ws);

    ws.on("close", () => {
      console.log("Client disconnected");
      clients.delete(ws);
    });
  });

  function broadcast(data) {
    const message = JSON.stringify(data);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  return broadcast;
}

module.exports = initWebSocket;
