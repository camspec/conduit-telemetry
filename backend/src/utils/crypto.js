const crypto = require("node:crypto");

function generateApiKey() {
  const bytes = crypto.randomBytes(32);
  return bytes.toString("hex");
}

module.exports = { generateApiKey };
