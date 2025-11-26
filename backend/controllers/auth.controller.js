import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateAccessToken36 } from "../utils/token.js";

export const signUp = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    let user = await User.findOne({ email }).exec();
    if (user) {
      return res.status(400).json({ message: "Email already in use" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
    );
    const accessToken = generateAccessToken36();
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setHours(
      tokenExpiresAt.getHours() + (parseInt(process.env.TOKEN_TTL_HOURS) || 24)
    );

    user = new User({
      username,
      email,
      password: hashedPassword,

      role,
      accessToken,
      tokenExpiresAt,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Handle common expected errors with helpful messages
    if (error.code === 11000) {
      // duplicate key (unique index) error
      return res.status(400).json({ message: "Email already in use" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // If a role was provided in the signin request, ensure it matches the stored user role
    if (role && user.role !== role) {
      return res
        .status(403)
        .json({ message: `User is not authorized as role '${role}'` });
    }
    const accessToken = generateAccessToken36();
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setHours(
      tokenExpiresAt.getHours() + (parseInt(process.env.TOKEN_TTL_HOURS) || 24)
    );
    user.accessToken = accessToken;
    user.tokenExpiresAt = tokenExpiresAt;
    await user.save();
    // Return access token along with the user's role so frontend can redirect appropriately
    res.json({ accessToken, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const signOut = async (req, res) => {
  try {
    const user = req.user;
    user.accessToken = null;
    user.tokenExpiresAt = null;
    await user.save();
    res.json({ message: "Signed out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
