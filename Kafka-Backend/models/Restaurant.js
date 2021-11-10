const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
    },
    address_line: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zipcode: {
      type: String,
    },
    desc: {
      type: String,
    },
    contact_no: {
      type: String,
    },
    del_type: {
      type: String,
      enum: ['Delivery', 'Pickup', 'Both'],
    },
    dish_types:[String],
    restaurantImages:[String],
    start: {
      type: Date,
    },
    end: {
      type: Date,
    },
    dishes: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        ingredients: {
          type: String,
        },
        desc: {
          type: String,
        },
        dishType: {
          type: String,
          enum: ['Appetizer', 'Salad', 'Main course', 'Dessert', 'Beverage'],
        },
        category: {
          type: String,
          enum: ['Veg', 'Non-veg', 'Vegan'],
        },
        dishImages: [{ image: { type: String } }],
      },
    ],
  });

module.exports = mongoose.model('Restaurant', RestaurantSchema);