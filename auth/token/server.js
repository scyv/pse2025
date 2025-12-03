const express = require("express");
const app = express();
const PORT = 3000;

const VALID_USERS = {
  1234567: {
    name: "Admin",
  },
  abcdefg: {
    name: "User",
  },
};

function tokenAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("1. Authorization Header:", authHeader || "NOT PRESENT");

  if (!authHeader) {
    return res.status(401).send("Authentication required");
  }

  if (!authHeader.startsWith("Bearer ")) {
    console.log("2. Invalid auth method - expected Bearer");
    return res.status(401).send("Invalid authentication method");
  }

  const token = authHeader.slice(7);
  console.log("3. Token: ", token);

  const user = VALID_USERS[token];

  if (user) {
    console.log("4. Authentication SUCCESS for user:", user.name);
    req.user = user.name;
    console.log("=== AUTH FLOW END ===\n");
    next();
  } else {
    console.log("4. Authentication FAILED - invalid credentials");
    console.log("=== AUTH FLOW END ===\n");
    return res.status(401).send("Invalid credentials");
  }
}

// Protected route - requires authentication
app.get("/api/data", tokenAuth, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(
    JSON.stringify({
      user: req.user,
      some: "data",
    })
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
