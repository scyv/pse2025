const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static("public"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
