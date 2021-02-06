import React, { useEffect } from 'react';

import AppNavbar from './components/AppNavbar';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';

import { GlobalProvider } from './context/GlobalState';
import { FilmProvider } from './context/FilmState';

import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';


function App() {

  useEffect(() => {
    console.log ("Main App, useEffect called");
		const fetchUser = async () => {
      await store.dispatch(loadUser());
    }
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <Provider store={store}>
    <AppNavbar />

    {/* <GlobalProvider>
      <FilmProvider>
      <div className="container">
      </div>
      </FilmProvider>
    </GlobalProvider> */}
      </Provider>
  );
}

export default App;
