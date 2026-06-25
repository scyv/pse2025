const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.static("public"));

function parseJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], "base64url").toString("utf8");
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function requireJwt(req, res, next) {
  const auth = req.headers["authorization"];
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Kein Bearer-Token vorhanden" });
  }
  const token = auth.slice(7);
  const payload = parseJwt(token);
  if (!payload) {
    return res.status(401).json({ error: "Ungültiges Token-Format" });
  }
  if (payload.exp && Date.now() / 1000 > payload.exp) {
    return res.status(401).json({ error: "Token abgelaufen" });
  }
  req.jwtPayload = payload;
  next();
}

app.get("/api/protected", requireJwt, (req, res) => {
  const p = req.jwtPayload;
  res.json({
    message: "Geschützter Endpunkt erfolgreich aufgerufen!",
    user: p.preferred_username,
    email: p.email,
    roles: p.realm_access?.roles ?? [],
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
