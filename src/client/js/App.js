import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import PropTypes from 'prop-types';
import { MochawesomeReport, ReportDetail } from '../components';

const App = ({store}) => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/reports">reports</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/reports">
            <MochawesomeReport store={store} />
          </Route>
          <Route path="/detail">
            <ReportDetail store={store} />
          </Route>
          <Route path="/">
            <h2> Dashboard </h2>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

App.propTypes = {
  store: PropTypes.object,
};

export default App
