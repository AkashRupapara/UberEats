/* eslint-disable prefer-const */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const { make_request } = require('../kafka/client');

const Order = require('../models/Order');

const createOrder = async (req, res) => {
  make_request('order.create', req.headers, (err, response) => {
    if (err || !response) {
      if ('status' in err) {
        return res.status(err.status).send({ error: err.error });
      }
      return res.status(500).send({ error: err.message });
    }
    return res.status(201).send({ ...response });
  });
};

const placeOrder = async (req, res) => {
  make_request('order.place', req.body, (err, response) => {
    if (err || !response) {
      if ('status' in err) {
        return res.status(err.status).send({ error: err.error });
      }
      return res.status(500).send({ error: err.message });
    }
    return res.status(201).send({ response });
  });
};

const updateOrder = async (req, res) => {
  make_request('order.update', { ...req.params, ...req.headers, ...req.body }, (err, response) => {
    if (err || !response) {
      if ('status' in err) {
        return res.status(err.status).send({ error: err.error });
      }
      return res.status(500).send({ error: err.message });
    }
    return res.status(201).send({ response });
  });
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
          createdAt: -1,
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
          createdAt: -1,
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
