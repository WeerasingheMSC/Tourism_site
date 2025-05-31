import jwt from "jsonwebtoken";

/**
 * Protect routes, ensure we have a valid JWT
 */
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];
  try {
    // verifies token and returns payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
