import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["customer", "banker"],
      default: "customer",
      required: true,
    },
    accessToken: { type: String, default: null },
    tokenExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
