/* eslint-disable prefer-const */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');

const Cart = require('../models/Cart');

const Order = require('../models/Order');

const createOrder = async (req, res) => {
  const custId = req.headers.id;
  const cartDetails = await Cart.aggregate([
    {
      $match: {
        custId: mongoose.Types.ObjectId(String(custId)),
      },
    },
    {
      $lookup: {
        from: 'restaurants',
        localField: 'restId',
        foreignField: '_id',
        as: 'restaurants',
      },
    },
    {
      $unwind: {
        path: '$restaurants',
      },
    },
  ]);

  if (cartDetails.length === 0) {
    return res.status(404).send({ error: 'No Items in Cart' });
  }

  let dishes = new Map();
  if (
    cartDetails &&
    cartDetails.length > 0 &&
    cartDetails[0].restaurants &&
    cartDetails[0].restaurants.dishes &&
    cartDetails[0].restaurants.dishes.length > 0
  ) {
    cartDetails[0].restaurants.dishes.forEach((dish) => {
      dishes.set(dish._id.toString(), dish);
    });
  }

  let sumTotal = 0;
  let orderDishArray = [];

  cartDetails.forEach((item) => {
    sumTotal += item.totalPrice;
    orderDishArray.push({
      dishId: item.dishId,
      qty: item.qty,
      totalPrice: item.totalPrice,
      name: dishes.get(item.dishId.toString()).name,
    });
  });

  let orderObj = {};
  orderObj['restId'] = cartDetails[0].restaurants._id;
  orderObj['custId'] = cartDetails[0].custId;
  orderObj['totalOrderPrice'] = sumTotal;
  orderObj['tax'] = (sumTotal * 0.18).toFixed(2);
  orderObj['finalOrderPrice'] = (sumTotal * 1.18).toFixed(2);
  orderObj['dishes'] = orderDishArray;
  orderObj['status'] = 'Initialized';
  orderObj['createdAt'] = new Date();
  orderObj['updatedAt'] = new Date();

  const newOrder = new Order(orderObj);
  const createdOrder = await newOrder.save();

  if (createdOrder) {
    await Cart.find({
      custId: mongoose.Types.ObjectId(String(custId)),
    }).remove();
    return res.status(201).send({ orderId: createdOrder._id, message: 'Order Created' });
  }
  return res.status(500).send({ error: 'Error Creating Order' });
};

const placeOrder = async (req, res) => {
  const { type, address, id, notes } = req.body;

  let newAddr = '';
  if (type === 'Pickup') {
    newAddr = 'Pickup From Restaurant';
  } else {
    newAddr = address;
  }
  try {
    const updateOrder = await Order.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(String(id)),
      },
      {
        status: 'Placed',
        orderType: type,
        orderAddress: newAddr,
        updatedAt: new Date(),
        notes,
      }
    );
    return res.status(201).send({ message: 'Order Placed' });
  } catch (err) {
    return res.status(400).send(err);
  }
};

const updateOrder = async (req, res) => {
  const { status } = req.body;
  const { oid } = req.params;

  const orderDetails = await Order.findOne({
    _id: mongoose.Types.ObjectId(String(oid)),
  });

  const orderStatus = orderDetails.status;

  if (
    req.headers.role === 'customer' &&
    status === 'Cancelled' &&
    orderStatus !== 'Initialized' &&
    orderStatus !== 'Placed'
  ) {
    return res.status(400).send({ error: 'Order cannot be Cancelled' });
  }
  try {
    const updateStatus = await Order.updateOne(
      {
        _id: mongoose.Types.ObjectId(String(oid)),
      },
      {
        status,
      },
      {
        new: true,
      }
    );

    return res.status(201).send({ message: 'Order Status Updated' });
  } catch (err) {
    return res.status(404).send(err);
  }
};

const filterOrders = async (req, res) => {
  const { role, id } = req.headers;
  const { page = 1, limit = 5, orderStatus } = req.query;

  let orders;
  const checkProperties = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
        // eslint-disable-next-line no-param-reassign
        delete obj[key];
      }
    });
  };

  if (role === 'customer') {
    const custId = id;
    const filterParams = { custId: mongoose.Types.ObjectId(String(custId)), status: orderStatus };

    checkProperties(filterParams);
    const custOrders = await Order.find(filterParams);

    const count = custOrders.length;

    orders = await Order.aggregate([
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restId',
          foreignField: '_id',
          as: 'restaurant',
        },
      },
      {
        $match: filterParams,
      },
      {
        $sort: {
          'createdAt': -1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit * 1,
      },
    ]);

    orders.forEach((item) => {
      item['restName'] = item.restaurant[0].name;
      if (item.restaurant[0].restaurantImages.length > 0)
        item['restImage'] = item.restaurant[0].restaurantImages[0];
      else item['restImage'] = '';
      delete item.restaurant;
    });

    return res
      .status(200)
      .send({ orders, totalDocs: count, totalPages: Math.ceil(count / limit), currentPage: page });
  } else if (role === 'restaurant') {
    const restId = id;
    const filterParams = { restId: mongoose.Types.ObjectId(String(restId)), status: orderStatus };
    checkProperties(filterParams);

    const restOrders = await Order.find(filterParams);

    const count = restOrders.length;
    orders = await Order.aggregate([
      {
        $lookup: {
          from: 'customers',
          localField: 'custId',
          foreignField: '_id',
          as: 'customer',
        },
      },
      {
        $match: filterParams,
      },
      {
        $sort: {
          'createdAt': -1,
        },
      },
      {
        $limit: limit * 1,
      },
      {
        $skip: (page - 1) * limit,
      },
    ]);

    orders.forEach((item) => {
      item['custName'] = item.customer[0].name;
      item['custImage'] = item.customer[0].profile_img;
      delete item.customer;
    });

    return res
      .status(200)
      .send({ orders, totalDocs: count, totalPages: Math.ceil(count / limit), currentPage: page });
  }
};

const getOrders = async (req, res) => {
  const { role, id } = req.headers;
  let orders;
  if (role === 'customer') {
    orders = await Order.aggregate([
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restId',
          foreignField: '_id',
          as: 'restaurant',
        },
      },
      {
        $match: { custId: mongoose.Types.ObjectId(String(id)) },
      },
    ]);
    orders.forEach((item) => {
      item['restName'] = item.restaurant[0].name;
      if (item.restaurant[0].restaurantImages.length > 0)
        item['restImage'] = item.restaurant[0].restaurantImages[0];
      else item['restImage'] = '';
      delete item.restaurant;
    });

    return res.status(200).send(orders);
  } else if (role === 'restaurant') {
    orders = await Order.aggregate([
      {
        $lookup: {
          from: 'customers',
          localField: 'custId',
          foreignField: '_id',
          as: 'customer',
        },
      },
      {
        $match: { restId: mongoose.Types.ObjectId(String(id)) },
      },
    ]);

    orders.forEach((item) => {
      item['custName'] = item.customer[0].name;
      item['custImage'] = item.customer[0].profile_img;
      delete item.customer;
    });

    return res.status(200).send(orders);
  }
};

const getOrderById = async (req, res) => {
  const { role } = req.headers;
  const { oid } = req.params;
  const { id } = req.headers;

  let orderDetails = {};
  if (role === 'restaurant') {
    orderDetails = await Order.aggregate([
      {
        $lookup: {
          from: 'customers',
          localField: 'custId',
          foreignField: '_id',
          as: 'customer',
        },
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restId',
          foreignField: '_id',
          as: 'restaurant',
        },
      },
      {
        $match: {
          _id: mongoose.Types.ObjectId(String(oid)),
          restId: mongoose.Types.ObjectId(String(id)),
        },
      },
    ]);
    if (orderDetails) {
      orderDetails.forEach((item) => {
        item['custName'] = item.customer[0].name;
        item['delType'] = item.restaurant[0].del_type;
        if (item.restaurant[0].restaurantImages && item.restaurant[0].restaurantImages.length > 0)
          item['restImage'] = item.restaurant[0].restaurantImages[0];
        else item['restImage'] = '';
        delete item.restaurant;
        delete item.customer;
      });
      return res.status(200).send(orderDetails[0]);
    }

    return res.status(404).send({ error: 'Restuarant Order Not Found' });
  }

  orderDetails = await Order.aggregate([
    {
      $lookup: {
        from: 'restaurants',
        localField: 'restId',
        foreignField: '_id',
        as: 'restaurant',
      },
    },
    {
      $match: {
        _id: mongoose.Types.ObjectId(String(oid)),
        custId: mongoose.Types.ObjectId(String(id)),
      },
    },
  ]);

  if (orderDetails) {
    orderDetails.forEach((item) => {
      item['restName'] = item.restaurant[0].name;
      item['delType'] = item.restaurant[0].del_type;
      if (item.restaurant[0].restaurantImages && item.restaurant[0].restaurantImages.length > 0)
        item['restImage'] = item.restaurant[0].restaurantImages[0];
      else item['restImage'] = '';
      delete item.restaurant;
    });
    return res.status(201).send(orderDetails[0]);
  }

  return res.status(404).send({ error: 'Customer Order Not Found' });
};
module.exports = {
  createOrder,
  placeOrder,
  updateOrder,
  getOrders,
  getOrderById,
  filterOrders,
};
