/* eslint-disable prefer-const */
const express = require('express');
const cors = require('cors');

const app = express();

let corsOptions = {
  origin: 'http://localhost:8081',
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to bezkoder application.' });
});

// const swaggerUi = require('swagger-ui-express');

const { sequelize } = require('./models/data.model');

// sequelize.sync({ alter: true });
sequelize.sync();

const authRouter = require('./routes/auth');
const { checkAuth } = require('./config/checkAuthority');

const restaurant = require('./routes/restuarant');
const dishes = require('./routes/dishes');
const customers = require('./routes/customers');
const cart = require('./routes/cart');


app.use('/auth', authRouter);

app.use(checkAuth);

app.use('/restaurant', restaurant);
app.use('/dishes', dishes);
app.use('/customers', customers);
app.use('/cart', cart);

/// For dropping existing tables in database
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
//   });

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
