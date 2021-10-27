/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');

const {
  customers,
  orders,
  customer_address,
  fvrts,
  restaurants,
  restaurant_imgs,
  restaurant_dishtypes,
} = require("../models/data.model");
const Customer = require("../models/Customer");

const createCustomer = async (req, res) => {
  try {
    // Get user input
    // eslint-disable-next-line object-curly-newline
    // Validate user input
    if (!(req.body.name && req.body.email && req.body.password)) {
      res.status(400).send({ error: "All input is required" });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldCust = await Customer.findOne({
      email: req.body.email,
    });

    if (oldCust) {
      return res
        .status(409)
        .send({ error: "User Already Exist. Please Login" });
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    // Create user in our database---------------
    req.body.password = encryptedPassword;

    const newCustomer = new Customer(req.body);
    const createdCust = await newCustomer.save();
    const email = req.body.email;

    console.log(createdCust._id);
    const token = jwt.sign(
      { c_id: createdCust._id, email, role: "customer" },
      "UberEats",
      {
        expiresIn: "2h",
      }
    );
    return res.status(201).json({ token });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

const customerLogin = async (req, res) => {
  if (!(req.body.email && req.body.password)) res.status(400).send({error: "All input is required"});

  const cust = await Customer.findOne({
      email: req.body.email,
  }).select("password");

  if (!cust) {
    res.status(409).send({error: "User does not exist"});
  } else {
    bcrypt.compare(req.body.password, cust.password, (err, result) => {
      if (err) {
        // handle error
        res.status(409).send({error: "Error Verifying details!"});
      }
      const email = req.body.email;
      if (result) {
        // Send JWT
        const token = jwt.sign(
          { c_id: cust._id, email, role: "customer" },
          "UberEats",
          {
            expiresIn: "2h",
          }
        );
        cust.token = token;
        res.status(201).json({ token });
      } else {
        return res.json({ success: false, message: "passwords do not match" });
      }
    });
  }
};

const updateCustomer = async (req, res) => {
  const custId = req.headers.id;
  if (String(custId) !== String(req.params.cid))
    return res.status(401).send("Unauthorised");

  const cust = await customers.findOne({
    _id: mongoose.Types.ObjectId(String(custId)),
  });

  try {
    await Customer.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(String(custId)),
      },
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    return res.status(201).send({ message: "Customer Updated" });
  } catch (err) {
    return res.status(404).send(err);
  }
};

const addAddress = async (req, res) => {
  try {
    const custId = req.headers.id;
    const { role } = req.headers;
    const { address, zipcode } = req.body;

    if (!custId || role === "restaurant") {
      return res.status(401).send({ error: "Unauthorised Access" });
    }
    if (role === "customer") {
      const findExistAddress = await customer_address.findOne({
        where: {
          c_id: custId,
          ca_address_line: address,
          ca_zipcode: zipcode,
        },
      });

      if (findExistAddress) {
        return res.status(409).send({ error: "Address Already Exists" });
      }
      await customer_address.create({
        ca_address_line: address,
        ca_zipcode: zipcode,
        c_id: custId,
      });
    }
    res.status(201).send({ msg: "Address Added" });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAddress = async (req, res) => {
  const custId = req.headers.id;

  try {
    const custAddr = await customer_address.findAll({
      where: {
        c_id: custId,
      },
    });

    if (custAddr.length === 0 || !custAddr) {
      return res.staus(404).send({ error: "No Addresses Found" });
    }
    return res.status(201).send(custAddr);
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteCustomer = async (req, res) => {
  const custID = req.params.cid;
  if (!custID) return res.status(404).send("Need Customer ID");

  const cust = await customers.findOne({
    where: {
      c_id: custID,
    },
  });

  if (!cust) return res.status(403).send("Customer does not exist");
  try {
    cust.destroy();
    return res.status(201).send("Customer deleted");
  } catch (err) {
    return res.status(404).send(err);
  }
};

const getCustomerProfile = async (req, res) => {
  const custId = req.headers.id;
  const cust = await Customer.findOne({
    _id: mongoose.Types.ObjectId(String(custId)),
  });

  if (!cust) {
    return res.status(404).send({error: "Customer does not exists"});
  }
  return res.status(201).send(cust);
};

const getCustomerById = async (req, res) => {
  const cust = await Customer.findOne({
    _id: mongoose.Types.ObjectId(String(req.params.cid)),
  });
  if (!cust) {
    return res.status(404).send({error: "Customer does not exists"});
  }
  return res.status(201).send(cust);
};

const getAllCustomers = async (req, res) => {
  const rid = req.headers.id;

  const custs = await orders.findAll({
    attributes: ["c_id"],
    include: [
      {
        model: customers,
      },
    ],
    where: {
      r_id: rid,
    },
  });
  return res.status(201).send(custs);
};

const addToFavorites = async (req, res) => {
  const custId = req.headers.id;
  const restId = req.body.rid;
  if (!custId) {
    return res.status(404).send({ error: "Customer Id Not FOund" });
  }

  try {
    const findRest = await restaurants.findOne({
      where: {
        r_id: restId,
      },
    });

    if (!findRest) {
      return res.status(404).send({ error: "Restaurant do not exist" });
    }

    const existingFvrt = await fvrts.findOne({
      where: {
        c_id: custId,
        r_id: restId,
      },
    });

    if (existingFvrt) {
      return res
        .status(201)
        .send({ message: "Restaurant is already added to fvrts" });
    }
    const addFavorite = await fvrts.create({
      r_id: restId,
      c_id: custId,
    });
  } catch (err) {
    return res.status(500).send(err);
  }

  return res.status(200).send({ message: "Added to Favorites" });
};

const deleteFromFavorites = async (req, res) => {
  const custId = req.headers.id;
  const restId = req.params.rid;
  if (!custId) {
    return res.status(404).send({ error: "Customer Id Not FOund" });
  }

  try {
    await fvrts.destroy({
      r_id: restId,
      c_id: custId,
    });
  } catch (err) {
    return res.status(500).send(err);
  }

  return res.status(200).send({ message: "Removed from Favorites" });
};

const getAllFavorites = async (req, res) => {
  const custId = req.headers.id;
  if (!custId) {
    return res.status(404).send({ error: "Customer Id Not Found" });
  }

  try {
    const custFvrts = await fvrts.findAll({
      include: [
        {
          model: restaurants,
          include: [restaurant_imgs, restaurant_dishtypes],
        },
      ],
      where: {
        c_id: custId,
      },
    });

    return res.status(200).send(custFvrts);
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = {
  createCustomer,
  customerLogin,
  updateCustomer,
  deleteCustomer,
  getCustomerProfile,
  getCustomerById,
  getAllCustomers,
  addAddress,
  getAddress,
  addToFavorites,
  deleteFromFavorites,
  getAllFavorites,
};
