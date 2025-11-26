import User from "../models/user.model.js";

export async function authMiddleware(req, res, next) {
  try {
    const header = req.header("Authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const user = await User.findOne({ accessToken: token }).exec();
    if (!user) return res.status(401).json({ message: "Invalid token" });

    if (user.tokenExpiresAt && user.tokenExpiresAt < new Date()) {
      return res.status(401).json({ message: "Token expired" });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== role)
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
