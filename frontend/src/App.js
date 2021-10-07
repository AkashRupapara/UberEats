import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider, styled } from 'baseui';
import { StatefulInput } from 'baseui/input';

import Home from './Components/Home';
import CustomerLogin from './Components/Customer/CustomerLogin';
import CustomerRegistration from './Components/Customer/CustomerRegistration';
import { Toaster } from 'react-hot-toast'
import RestaurantRegistration from './Components/Restaurant/RestaurantRegistration';
import RestaurantLogin from './Components/Restaurant/RestaurantLogin';
import RestaurantDashboard from './Components/Restaurant/RestaurantDashboard'
import MediaUploader from './Components/MediaUploader';
import UpdateRestaurant from './Components/Restaurant/UpdateRestaurant';
import CustomerDashboard from './Components/Customer/CustomerDashboard';
import PlaceOrder from './Components/Customer/PlaceOrder';
import UpdateCustomer from './Components/Customer/UpdateCustomer';
import RestaurantDetails from './Components/Customer/RestaurantDetails';

const engine = new Styletron();

function App() {
  return (
    <div className="App">
      <StyletronProvider value={engine}>
        <BaseProvider theme={LightTheme} zIndex={1500}>
          <React.Suspense fallback={<span> Loading...</span>}>
            <Toaster />
            <Router>
              <Switch>
                <Route path="/customer/login" component={CustomerLogin} />
                <Route path="/customer/register" component={CustomerRegistration} />
                <Route path="/restaurant/login" component={ RestaurantLogin } />
                <Route path="/restaurant/register" component={RestaurantRegistration} />
                <Route path="/restaurant/dashboard" component={RestaurantDashboard} />
                <Route path="/customer/dashboard" component={CustomerDashboard} />
                <Route path="/restaurant/update" component={UpdateRestaurant} />
                <Route path="/customer/update" component={UpdateCustomer} />
                <Route path="/customer/restaurant/:restId" component={RestaurantDetails} />
                <Route path="/customer/placeorder/:oid" component={PlaceOrder} />
                <Route path="/mediaUploader" component={MediaUploader} />
                
                <Route path="/" component={Home} />
              </Switch>

            </Router>
          </React.Suspense>
        </BaseProvider>
      </StyletronProvider>
    </div>
  );
}

export default App;
