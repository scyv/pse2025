const express = require("express");
const crypto = require("crypto");
const app = express();
const PORT = 3000;

const KEYCLOAK_JWKS_URL =
  "http://localhost:8780/realms/SuperApp/protocol/openid-connect/certs";

const jwksCache = new Map();

async function getPublicKey(kid) {
  if (jwksCache.has(kid)) return jwksCache.get(kid);

  const resp = await fetch(KEYCLOAK_JWKS_URL);
  if (!resp.ok) throw new Error("JWKS-Endpunkt nicht erreichbar");
  const { keys } = await resp.json();

  for (const jwk of keys) {
    // crypto.createPublicKey versteht JWK direkt (Node >= 15)
    const key = crypto.createPublicKey({ key: jwk, format: "jwk" });
    jwksCache.set(jwk.kid, key);
  }

  return jwksCache.get(kid) ?? null;
}

// RS256-Signatur prüfen – nur crypto + fetch (Bordmittel)
async function verifyJwt(token) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Kein gültiges JWT-Format");

  const header  = JSON.parse(Buffer.from(parts[0], "base64url").toString());
  const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());

  if (header.alg !== "RS256")
    throw new Error(`Algorithmus ${header.alg} nicht unterstützt`);

  const publicKey = await getPublicKey(header.kid);
  if (!publicKey) throw new Error(`Unbekannter kid: ${header.kid}`);

  const signedData = Buffer.from(`${parts[0]}.${parts[1]}`);
  const signature  = Buffer.from(parts[2], "base64url");

  const valid = crypto.verify("SHA256", signedData, publicKey, signature);
  if (!valid) throw new Error("Signatur ungültig");

  if (payload.exp && Date.now() / 1000 > payload.exp)
    throw new Error("Token abgelaufen");

  return payload;
}

async function requireJwt(req, res, next) {
  const auth = req.headers["authorization"];
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Kein Bearer-Token vorhanden" });
  }
  try {
    req.jwtPayload = await verifyJwt(auth.slice(7));
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

app.use(express.static("public"));

app.get("/api/protected", requireJwt, (req, res) => {
  const p = req.jwtPayload;
  res.json({
    message: "Geschützter Endpunkt erfolgreich aufgerufen!",
    user: p.preferred_username,
    email: p.email,
    roles: p.realm_access?.roles ?? [],
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
