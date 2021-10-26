/* eslint-disable prefer-const */
const express = require('express');
const cors = require('cors');

const app = express();
const mongoose = require('mongoose');
const expressSwagger = require('express-swagger-generator')(app);

let options = {
  swaggerDefinition: {
      info: {
          description: 'Ubereats',
          title: 'Swagger',
          version: '1.0.0',
      },
      host: 'localhost:8080',
      basePath: '/',
      produces: [
          "application/json",
      ],
      schemes: ['http', 'https'],
      securityDefinitions: {
          JWT: {
              type: 'apiKey',
              in: 'header',
              name: 'Authorization',
              description: "",
          }
      }
  },
  basedir: __dirname, //app absolute path
  files: ['./routes/**/*.js'] //Path to the API handle folder
};
expressSwagger(options)

let corsOptions = {
  origin: 'http://localhost:8081',
};

// app.use(cors(corsOptions));

app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
const { getAccessMiddleware } = require('u-server-utils');

const { sequelize } = require('./models/data.model');

// sequelize.sync({ alter: true });
sequelize.sync();

const authRouter = require('./routes/auth');
const { validateToken } = require('./config/validateToken');
const restaurant = require('./routes/restuarant');
const dishes = require('./routes/dishes');
const customers = require('./routes/customers');
const cart = require('./routes/cart');
const orders = require('./routes/orders');
const accessControl = require('./controllers/accessController');

app.use('/auth', authRouter);

app.use(validateToken);
// app.use(getAccessMiddleware(accessControl));

app.use('/restaurant', restaurant);
app.use('/dishes', dishes);
app.use('/customers', customers);
app.use('/cart', cart);
app.use('/orders', orders);



const main = async () =>{
  try{
    await mongoose.connect('mongodb+srv://admin:Akash1743a@cluster0.pdnmu.mongodb.net/ubereats?retryWrites=true&w=majority',{
      useNewUrlParser: 'true',
      autoIndex: true,
    });
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      
    });
  }catch(err){
    console.log(err);
  }
}

main().catch(console.error);
