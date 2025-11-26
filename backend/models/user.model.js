import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
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
    balanceCents: { type: Number, default: 0 },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
