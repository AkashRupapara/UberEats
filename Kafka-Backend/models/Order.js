const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  restId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  custId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  totalOrderPrice: {
    type: Number,
  },
  tax: {
    type: Number,
  },
  finalOrderPrice: {
    type: Number,
  },
  dishes: [
    {
      dishId: { type: mongoose.Schema.Types.ObjectId },
      qty: { type: Number },
      totalPrice: { type: Number },
      name: {type: String},
    },
  ],
  orderType: {
    type: String,
    enum: ['Delivery',
    'Pickup',]
  },
  status:{
    type: String,
    enum: ['Initialized',
    'Placed',
    'Preparing',
    'Ready',
    'Picked Up',
    'On the Way',
    'Delivered',
    'Cancelled',],
  },
  orderAddress: {
    type: String,
  },
  createdAt:{
    type: Date
  },
  updatedAt:{
    type: Date
  },
  notes:{
    type: String
  }
});

module.exports = mongoose.model('Order', OrderSchema);
