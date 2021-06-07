import React, { useEffect } from "react";

import AppNavbar from "./components/AppNavbar";
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/authActions";

import "bootstrap/dist/css/bootstrap.min.css";

// import './App.css';

function App() {
  useEffect(() => {
    console.log("Main App, useEffect called");
    const fetchUser = async () => {
      await store.dispatch(loadUser());
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Provider store={store}>
      <AppNavbar />

      {/* <GlobalProvider>
      <div className="container">
      </div>
    </GlobalProvider> */}
    </Provider>
  );
}

export default App;
