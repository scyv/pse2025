const express = require("express");
const app = express();
const PORT = 3000;

const VALID_USERS = {
  admin: "password123",
  user: "secret456",
};

const sessions = {};

function cookieAuth(req, res, next) {
  const cookieHeader = req.headers.cookie;
  console.log("1. Cookie Header:", cookieHeader || "NOT PRESENT");

  if (!cookieHeader) {
    console.log("2. No cookie header found");
    return res.status(401).send("Authentication required");
  }

  if (!cookieHeader.startsWith("supersession=")) {
    console.log("2. Invalid cookie");
    return res.status(401).send("Invalid authentication method");
  }

  const cookieValue = cookieHeader.slice(cookieHeader.indexOf("=") + 1);
  console.log("3. Cookie Value/SessionID:", cookieValue);

  const session = sessions[cookieValue];

  if (session) {
    console.log("4. Session found");
    req.user = session;
    next();
  } else {
    console.log("4. No session found - invalid credentials");
    return res.status(401).send("Invalid credentials");
  }
}

// Middleware to serve static files
app.use(express.static("public"));

app.post("/login", express.urlencoded({ extended: false }), (req, res) => {
  const user = req.body.username;
  const pass = req.body.password;

  console.log("Try loggin in: ", user);

  const storedUser = VALID_USERS[user];

  if (storedUser && storedUser === pass) {
    console.log("Login success!");
    const sessionId = "session-" + new Date().toISOString();
    sessions[sessionId] = {
      name: user,
      some: "data",
      sessionId: sessionId,
    };
    res.setHeader("location", "/protected");
    res.setHeader("Set-Cookie", `supersession=${sessionId}; Max-Age=10`);
    return res.status(302).send();
  }

  console.log("Login failed!");

  return res.status(401).send("Invalid credentials");
});

// Protected route - requires authentication
app.get("/protected", cookieAuth, (req, res) => {
  res.send(`
        <h1>Protected Area</h1>
        <p>Welcome, <strong>${req.user.name}</strong> (sessionId=${req.user.sessionId})! You have successfully authenticated.</p>
        <p>This content is only visible to authenticated users.</p>
        <a href="/">Back to Home</a>
        <button onclick="logout()"">Logout</button>
        <script>
            function logout() {
                fetch("/logout", { method: "POST" });
            }
        </script>

    `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
