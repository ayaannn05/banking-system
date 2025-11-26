import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["DEPOSIT", "WITHDRAW"], required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, default: 0 },
  transactions: [transactionSchema],
});

export default mongoose.model("Account", accountSchema);
