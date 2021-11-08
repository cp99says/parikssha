import Home from "components/landing/Home";
import "./App.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import RootDashboard from "components/dashbaord/RootDashboard";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/dashboard" component={RootDashboard} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
