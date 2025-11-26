import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import {
  listAccounts,
  getUserTransactions,
} from "../controllers/banker.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole("banker"));

router.get("/accounts", listAccounts);
router.get("/accounts/:accountId/transactions", getUserTransactions);

export default router;
