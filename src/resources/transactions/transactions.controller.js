const transactionModel = require("./transactions.model");
const walletModel = require("../wallet/wallet.model");
const userModel = require("../users/users.model");
const { validationResult } = require("express-validator");
const currency = require("../../Utils/moneyFormating");
const jwt = require("jsonwebtoken");


const getAll = async (req, res) => {
  const transaction = await transactionModel.all();
  return res.status(200).json(transaction);
};

const getOne = async (req, res) => {
  const transaction = await transactionModel.get(req.params.id);
  if (transaction) {
    return res.status(200).json(transaction);
  }
  return res.status(404).end();
};

const update = (req, res) => {
  const updateTransaction = req.body;

  const transactionUpdated = transactionModel.update(
    req.params.id,
    updateTransaction
  );

  return res.status(200).json(transactionUpdated);
};

const remove = (req, res) => {
  const transactionWithoutTheDeleted = transactionModel.remove(req.params.id);
  return res.status(200).json(transactionWithoutTheDeleted);
};

const handleTransaction = async (payload) => {
  const user = jwt.decode(req.headers.authorization.split(" ")[1]);
  if (user._id == payload.sender) {payload = JSON.parse(payload);
  console.log(payload);
  if (payload.amount < 0) {
    return "Amount not a postive number";
  }
  const sender = await walletModel.getOne(payload.sender);
  const targetUser = await userModel.getByEmail(payload.receiver);
  const receiver = await walletModel.getByUser(targetUser._id);

  if (payload.sender == receiver._id) return "Cannot send money to yourself";

  const newTransaction = {
    sender: payload.sender,
    receiver: receiver._id,
    amount: currency.EURO(payload.amount).format(),
  };
  const moneyToAddOrSubstract = currency.EURO(payload.amount); //validar primero si la wallet tiene el dinero que pretende enviar.
  if (
    currency.EURO(sender.funds).value >=
    currency.EURO(moneyToAddOrSubstract).value
  ) {
    const walletSuma = await walletModel.updateOne(receiver, {
      funds: currency.EURO(receiver.funds).add(moneyToAddOrSubstract).format(),
    });
    const walletResta = await walletModel.updateOne(sender, {
      funds: currency
        .EURO(sender.funds)
        .subtract(moneyToAddOrSubstract)
        .format(),
    });
    const transactionCreated = transactionModel.create(newTransaction);
  }} else {
    return res.status(401);
  }
};

const getTransactionsBySender = async (req, res) => {
  const verifyWallet = await walletModel.getByUser(
    jwt.decode(req.headers.authorization.split(" ")[1])
  );
  if (verifyWallet._id == req.params.id) {
    const outgoingTransactions = await transactionModel.getBySender(
      req.params.id
    );
    outgoingTransactions.map((e) => {
      const amountValue = currency.EURO(e.amount).value;
      e.amount = currency.EURO(-amountValue).format();
    });
    outgoingTransactions.slice(0, 10);
    return res.status(200).json(outgoingTransactions);
  } else {
    return res.status(401);
  }
};

const getTransactionsByReceiver = async (req, res) => {
  const verifyWallet = await walletModel.getByUser(
    jwt.decode(req.headers.authorization.split(" ")[1])
  );
  if (verifyWallet._id == req.params.id) {const incomingTransactions = await transactionModel.getByReceiver(
    req.params.id
  );
  incomingTransactions.slice(0, 10);
  return res.status(200).json(incomingTransactions);} else {
    return res.status(401);
  }
};

const getAllWalletTransactions = async (req, res) => {
  const verifyWallet = await walletModel.getByUser(
    jwt.decode(req.headers.authorization.split(" ")[1])
  );
  if (verifyWallet._id == req.params.id) {const incomingTransactions = await transactionModel.getByReceiver(
    req.params.id
  );
  const outgoingTransactions = await transactionModel.getBySender(
    req.params.id
  );
  outgoingTransactions.map((e) => {
    const amountValue = currency.EURO(e.amount).value;
    e.amount = currency.EURO(-amountValue).format();
  });

  let allTransactions = incomingTransactions.concat(outgoingTransactions);
  allTransactions.sort((a, b) => {
    var c = new Date(a.date);
    var d = new Date(b.date);
    return d - c;
  });

  allTransactions = allTransactions.slice(0, 10);

  return res.status(200).json(allTransactions);} else {
    return res.status(401);

  }
};
const getBySenderLastWeek = async (req, res) => {
  const verifyWallet = await walletModel.getByUser(
    jwt.decode(req.headers.authorization.split(" ")[1])
  );
  if (verifyWallet._id == req.params.id) { try {
    const outgoingTransactions = await transactionModel.getBySender$DateRange(
      req.params.id
    );
    return res.status(200).json(outgoingTransactions);
  } catch (error) {
    console.log(error);
  }} else {
    return res.status(401);

  }
};
const getByReceiverLastWeek = async (req, res) => {
  const verifyWallet = await walletModel.getByUser(
    jwt.decode(req.headers.authorization.split(" ")[1])
  );
  if (verifyWallet._id == req.params.id) {try {
    const ingoingTransactions = await transactionModel.getByReceiver$DateRange(
      req.params.id
    );
    return res.status(200).json(ingoingTransactions);
  } catch (error) {
    console.log(error);
  }} else {
    return res.status(401);

  }
};

module.exports = {
  update,
  getAll,
  getOne,
  remove,
  handleTransaction,
  getTransactionsBySender,
  getTransactionsByReceiver,
  getAllWalletTransactions,
  getBySenderLastWeek,
  getByReceiverLastWeek,
};
