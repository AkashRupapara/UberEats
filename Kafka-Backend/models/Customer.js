const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
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
  dob: {
    type: Date,
  },
  about: {
    type: String,
  },
  profile_img: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  nick_name: {
    type: String,
  },
  contact_no: {
    type: String,
  },
  addresses: [
    {
      address_line: {
        type: String,
      },
      zipcode: {
        type: String,
      },
    },
  ],
  fvrts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
});

module.exports = mongoose.model('Customer', CustomerSchema);
