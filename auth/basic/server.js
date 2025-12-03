const express = require("express");
const app = express();
const PORT = 3000;

const VALID_USERS = {
  admin: "password123",
  user: "secret456",
};

// https://mdn.github.io/shared-assets/images/diagrams/http/authentication/basic-auth.svg
function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("1. Authorization Header:", authHeader || "NOT PRESENT");

  if (!authHeader) {
    console.log("2. No auth header found - sending 401 with WWW-Authenticate");
    res.set("WWW-Authenticate", 'Basic realm="Protected Area"');
    return res.status(401).send("Authentication required");
  }

  if (!authHeader.startsWith("Basic ")) {
    console.log("2. Invalid auth method - expected Basic");
    return res.status(401).send("Invalid authentication method");
  }

  const base64Credentials = authHeader.slice(6);
  console.log("3. Base64 Credentials:", base64Credentials);

  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );
  console.log("4. Decoded Credentials:", credentials);

  const [username, password] = credentials.split(":");
  console.log("5. Username:", username);
  console.log("6. Password:", password ? "[HIDDEN]" : "EMPTY");

  if (VALID_USERS[username] && VALID_USERS[username] === password) {
    console.log("7. Authentication SUCCESS for user:", username);
    req.user = username;
    console.log("=== BASIC AUTH FLOW END ===\n");
    next();
  } else {
    console.log("7. Authentication FAILED - invalid credentials");
    console.log("=== BASIC AUTH FLOW END ===\n");
    res.set("WWW-Authenticate", 'Basic realm="Protected Area"');
    return res.status(401).send("Invalid credentials");
  }
}

// Middleware to serve static files
app.use(express.static("public"));

// Protected route - requires authentication
app.get("/protected", basicAuth, (req, res) => {
  res.send(`
        <h1>Protected Area</h1>
        <p>Welcome, <strong>${req.user}</strong>! You have successfully authenticated.</p>
        <p>This content is only visible to authenticated users.</p>
        <a href="/">Back to Home</a>
        <button onclick="logout()"">Logout</button>
        <script>
            function logout() {
                fetch("/protected", { method: "GET", headers: { "Authorization": "Basic logout" } });
            }
        </script>

    `);
});

// Another protected route
app.get("/admin", basicAuth, (req, res) => {
  res.send(`
        <h1>Admin Dashboard</h1>
        <p>Hello <strong>${req.user}</strong>!</p>
        <p>This is a protected admin area.</p>
        <h2>User Info:</h2>
        <ul>
            <li>Username: ${req.user}</li>
            <li>Access Time: ${new Date().toISOString()}</li>
        </ul>
        <a href="/">Back to Home</a>
    `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
