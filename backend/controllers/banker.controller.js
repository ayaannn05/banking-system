import Account from "../models/account.model.js";

export const listAccounts = async (req, res) => {
  try {
    // Populate user info: name, email, username
    const accounts = await Account.find()
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
    const account = await Account.findById(accountId)
      .populate("userId", "name email username")
      .exec();
    if (!account) return res.status(404).json({ message: "Account not found" });

    res.json({ account });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching transactions" });
  }
};
