import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateAccessToken36 } from "../utils/token.js";
import Account from "../models/account.model.js";

export const signUp = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    let user = await User.findOne({ email }).exec();
    if (user) {
      return res
        .status(400)
        .json({ message: "User found with same email / username" });
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
    // Create an empty account for customers so the Accounts table/log exists
    if (role === "customer") {
      try {
        const existing = await Account.findOne({ userId: user._id }).exec();
        if (!existing) {
          const acct = new Account({
            userId: user._id,
            balance: 0,
            transactions: [],
          });
          await acct.save();
        }
      } catch (acctErr) {
        console.error("Failed to create account on signup:", acctErr.message);
      }
    }
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Sign up failed" });
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
      return res.status(400).json({ message: "Invalid password" });
    }
    // role for redirection to correct dashboard, if customer redirect to customer dashboard
    if (role && user.role !== role) {
      return res.status(403).json({
        message: `Access denied for role: ${role}`,
      });
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
    res.status(500).json({ message: "SignIn failed" });
  }
};

export const signOut = async (req, res) => {
  try {
    let user = req.user;

    if (!user) {
      const header = req.header("Authorization") || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : null;
      if (!token) return res.status(401).json({ message: "No token provided" });
      user = await User.findOne({ accessToken: token }).exec();
      if (!user) return res.status(401).json({ message: "Invalid token" });
    }

    user.accessToken = null;
    user.tokenExpiresAt = null;
    await user.save();
    res.json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("signOut error:", error);
    res.status(500).json({ message: "SignOut failed" });
  }
};
