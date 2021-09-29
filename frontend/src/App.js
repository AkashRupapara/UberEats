import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider, styled } from 'baseui';
import { StatefulInput } from 'baseui/input';

import Home from './Components/Home';
import CustomerLogin from './Components/CustomerLogin';
import CustomerRegistration from './Components/CustomerRegistration';
import { Toaster } from 'react-hot-toast'
import RestaurantRegistration from './Components/RestaurantRegistration';
import RestaurantLogin from './Components/RestaurantLogin';
import RestaurantDashboard from './Components/RestaurantDashboard'
import MediaUploader from './Components/MediaUploader';
import UpdateRestaurant from './Components/UpdateRestaurant';

const engine = new Styletron();

function App() {
  return (
    <div className="App">
      <StyletronProvider value={engine}>
        <BaseProvider theme={LightTheme}>
          <React.Suspense fallback={<span> Loading...</span>}>
            <Toaster />
            <Router>
              <Switch>
                <Route path="/customerLogin" component={CustomerLogin} />
                <Route path="/customerRegister" component={CustomerRegistration} />
                <Route path="/restaurantLogin" component={ RestaurantLogin } />
                <Route path="/restaurantRegister" component={RestaurantRegistration} />
                <Route path="/restaurant/dashboard" component={RestaurantDashboard} />
                <Route path="/restaurant/update" component={UpdateRestaurant} />
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
