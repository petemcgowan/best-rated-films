import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/main.scss";
import homeStore from "./store/HomeStore";
import { BrowserRouter as Router } from "react-router-dom";
import reduxAuthStore from "./reduxAuthStore";
import { Provider } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ReactDOM.render(
  <Router>
    <Provider store={reduxAuthStore}>
      <App homeStore={homeStore} />
    </Provider>
  </Router>,
  document.getElementById("root")
);
