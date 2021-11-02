const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    dishId:{
        type: mongoose.Schema.Types.ObjectId,
    },
    restId:{
        type: mongoose.Schema.Types.ObjectId,
    },
    custId:{
        type: mongoose.Schema.Types.ObjectId,
    },
    qty:{
        type: Number,
    },
    totalPrice:{
        type: Number,
    }
  });

module.exports = mongoose.model('Cart', CartSchema);