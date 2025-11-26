import Account from "../models/account.model.js";

export const listAccounts = async (req, res) => {
  try {
    // Populate user info: name, email, username
    // Support optional sorting via query params: ?sortBy=balance&order=asc
    const { sortBy, order } = req.query;
    const sortObj = {};
    if (sortBy) {
      // default to ascending, use -1 for desc
      sortObj[sortBy] = String(order).toLowerCase() === "desc" ? -1 : 1;
    }

    const query = Account.find();
    if (Object.keys(sortObj).length) query.sort(sortObj);

    const accounts = await query
      .populate("userId", "name email username")
      .exec();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching accounts" });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const { accountId } = req.params;
    // Support sorting transactions
    const { sortBy = "createdAt", order = "desc" } = req.query;

    const account = await Account.findById(accountId)
      .populate("userId", "name email username")
      .exec();
    if (!account) return res.status(404).json({ message: "Account not found" });

    // Clone transactions to avoid mutating the mongoose doc state
    const transactions = (account.transactions || []).slice();

    const dir = String(order).toLowerCase() === "asc" ? 1 : -1;
    transactions.sort((a, b) => {
      if (sortBy === "amount") {
        return (a.amount - b.amount) * dir;
      }

      // default to createdAt
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return (ta - tb) * dir;
    });

    // Return account with sorted transactions
    const accountObj = account.toObject ? account.toObject() : { ...account };
    accountObj.transactions = transactions;

    res.json({ account: accountObj });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching transactions" });
  }
};
