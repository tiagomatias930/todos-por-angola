const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "nova-angola-secret-key-2026";
const JWT_EXPIRES_IN = "7d";

function generateToken(user) {
  return jwt.sign(
    { id: user.id, telefone: user.telefone, nome: user.nome },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Express middleware — extracts user from Bearer token.
 * Does NOT block the request if token is missing (optional auth).
 * Sets req.user if valid.
 */
function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, JWT_SECRET);
  } catch {
    // Invalid / expired token — treat as unauthenticated
  }
  next();
}

/**
 * Express middleware — requires a valid Bearer token.
 */
function requireAuth(req, res, next) {
  optionalAuth(req, res, () => {
    if (!req.user) {
      return res.status(401).json({ message: "Token ausente ou inválido." });
    }
    next();
  });
}

module.exports = { JWT_SECRET, generateToken, optionalAuth, requireAuth };
