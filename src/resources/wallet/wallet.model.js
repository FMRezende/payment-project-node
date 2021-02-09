const mongoose = require("mongoose");
// Define model schema
const walletModelSchema = mongoose.Schema({
<<<<<<< HEAD
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel'
    },
    comment: String,
    paymentMethod: Array,
    funds: Number
=======
  author: String, //hacer referencia a usermodel.
  comment: String,
  paymentMethod: Array, //puede quitarse.
  saldo: Number, //translate y tener en cuenta que afectara al controller.
>>>>>>> richard-transactionsQueries
});
// Compile model from schema
const Wallet = mongoose.model("WalletModel", walletModelSchema);

const create = (wallet) => {
  console.log(wallet);
  Wallet.create(wallet, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Created Docs : ", docs);
    }
  });
};
const getOne = async (id) => {
  let query = { _id: id };
  return await Wallet.findOne(query);
};
const all = async () => {
  return await Wallet.find().populate("id");
};
const remove = (id) => {
  let query = { _id: id };
  Wallet.deleteOne(query, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted Doc : ", docs);
    }
  });
};
const updateOne = (id, updateWallet) => {
  let query = { _id: id };
  Wallet.updateOne(query, updateWallet, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Updated Docs : ", docs);
    }
  });
};

const getByUser = async (id) => {
  let query = { author: id };
  return await Wallet.findOne(query);
}

module.exports = {
  create,
  updateOne,
  remove,
  getOne,
  all,
<<<<<<< HEAD
  getByUser
};
=======
};
>>>>>>> richard-transactionsQueries
