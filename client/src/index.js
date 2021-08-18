import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/main.scss";
import homeStore from "./store/HomeStore";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <App homeStore={homeStore} />
    </Provider>
  </Router>,
  document.getElementById("root")
);
