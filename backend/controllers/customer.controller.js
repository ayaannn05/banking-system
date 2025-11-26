import Account from "../models/account.model.js";


export const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) return res.status(400).json({ message: "Missing user id" });

    const account = await Account.findOne({ userId: userId });
    if (!account) return res.json({ balance: 0, transactions: [] });

    res.json({ balance: account.balance, transactions: account.transactions });
  } catch (error) {
    console.error("getTransactions error:", error);
    res.status(500).json({ message: "Server error fetching transactions" });
  }
};

export const deposit = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) return res.status(400).json({ message: "Missing user id" });

    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0)
      return res.status(400).json({ message: "Invalid deposit amount" });

    // create account for user doing first deposit

    const account = await Account.findOne({ userId: userId });
    if (!account) {
      const newAccount = new Account({
        userId: userId,
        balance: amount,
        transactions: [{ type: "DEPOSIT", amount }],
      });
      await newAccount.save();
      return res.json({
        balance: newAccount.balance,
        transactions: newAccount.transactions,
      });
    }

    // logic for add money to existing acc

    account.balance += amount;
    account.transactions.push({ type: "DEPOSIT", amount });

    await account.save();

    // sorting for latest transactions first at frontend
    res.json({
      balance: account.balance,
      transactions: account.transactions.sort(
        (a, b) => b.createdAt - a.createdAt
      ),
    });
  } catch (error) {
    console.error("deposit error:", error);
    res.status(500).json({ message: "Server error during deposit" });
  }
};

export const withdraw = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) return res.status(400).json({ message: "Missing user id" });

    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0)
      return res.status(400).json({ message: "Invalid withdrawal amount" });

    const account = await Account.findOne({ userId: userId });
    if (!account) return res.status(404).json({ message: "Account not found" });

    if (account.balance < amount)
      return res.status(400).json({ message: "Insufficient Funds" });

    account.balance -= amount;
    account.transactions.push({ type: "WITHDRAW", amount });

    await account.save();

    res.json({
      balance: account.balance,
      transactions: account.transactions.sort(
        (a, b) => b.createdAt - a.createdAt
      ),
    });
  } catch (error) {
    console.error("withdraw error:", error);
    res.status(500).json({ message: "Server error during withdrawal" });
  }
};
