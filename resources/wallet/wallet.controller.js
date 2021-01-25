const walletModel = require("./users.model"); //CAMBIAR PPR EL MODEL


const getOne = async (req, res) => {
  try {
    const user = await walletModel.getOne({id: req.params.id})
    res.status(200).json(user)
  } catch (error) {
    if (error.message === "wallet not found") return res.status(404).json({error: "wallet not found"});
    res.status(500).json(error);
}}

const createOne = (req, res) => {

  const newWallet = req.body;
  const walletUpdated = walletModel.create(newWallet)
  res.status(201).json(walletUpdated)
};


const updateOne = (req, res) => {
  const wallet = walletModel.updateOne(req.params.id, req.body);
  return res.status(200).json(wallet);
};


module.exports = {
  getOne,
  createOne,
  updateOne
};
