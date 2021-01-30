const transactionModel = require("./transactions.model");
const walletModel = require("../wallet/wallet.model");

const e = require("cors");

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

const create = (req, res) => {
  const newTransaction = req.body;
  const transactionCreated = transactionModel.create(newTransaction);

  return res.status(201).json(transactionCreated);
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

const handleTransaction = async (req, res) => {
  const newTransaction = req.body;
  const transactionCreated = transactionModel.create(newTransaction);
  const sender = await walletModel.getOne(req.body.sender);
  const receiver = await walletModel.getOne(req.body.receiver);

  const moneyToAddOrSubstract = req.body.amount;

  const walletSuma = walletModel.updateOne(receiver, {
    saldo: receiver.saldo + moneyToAddOrSubstract,
  });

  const walletResta = walletModel.updateOne(sender, {
    //lo unico que falta seria crear una nueva transaction cada vez que este metodo se ejecute.
    saldo: sender.saldo - moneyToAddOrSubstract,
  });

  return res.status(200).json({ transactionCreated, walletSuma, walletResta });
};

module.exports = {
  create,
  update,
  getAll,
  getOne,
  remove,
  handleTransaction,
};
