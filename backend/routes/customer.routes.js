import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import {
  getTransactions,
  deposit,
  withdraw,
} from "../controllers/customer.controller.js";

const router = express.Router();

// pass middleware function references
router.use(authMiddleware);
router.use(requireRole("customer"));

router.get("/transactions", getTransactions);
router.post("/deposit", deposit);
router.post("/withdraw", withdraw);

export default router;
