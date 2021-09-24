import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import {Client as Styletron} from 'styletron-engine-atomic';
import {Provider as StyletronProvider} from 'styletron-react';
import {LightTheme, BaseProvider, styled} from 'baseui';
import {StatefulInput} from 'baseui/input';
const engine = new Styletron();

const Home = React.lazy(() => import('./Components/Home'));
const CustomerLogin = React.lazy(() => import('./Components/CustomerLogin'));

function App() {
  return (
    <div className="App">
      <StyletronProvider value={engine}>
        <BaseProvider theme={LightTheme}>
          <React.Suspense fallback={<span> Loading...</span>}>
            <Router>
              <Switch>
                <Route path="/customerLogin" render={() => <CustomerLogin />} />
                <Route path="/" render={() => <Home />} />
              </Switch>
              
            </Router>
          </React.Suspense>
        </BaseProvider>
      </StyletronProvider>
    </div>
  );
}

export default App;
