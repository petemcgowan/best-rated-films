import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';
import store from '../store';

// Initial state
const initialState = {
  loggedInEmail: null,  // TODO: hard-coded for testing, populate at log in instead
  transactions: [],
  error: null,
  loading: true
}

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  async function getLoggedInEmail() {
    try {
      const state = store.getState();
      var email = "";
      if (state.user !=null) {
        email = state.user.email;
      }
      console.log ("getLoggedInEmail, state" +  JSON.stringify(state));
      console.log ("getLoggedInEmail, state.user" +  JSON.stringify(state.user));
      return email;
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error
      });
    }
  }


  // Actions
  async function addLoggedInEmail(email) {
    try {
      dispatch({
        type: 'ADD_LOGGED_IN_EMAIL',
        payload: email
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error
      });
    }
  }


  // Actions
  async function getTransactions() {
    try {
      const res = await axios.get('/api/transactions');
      console.log ("GlobalContext, getTransactions" + JSON.stringify(res.data.data));
      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error
      });
    }
  }


  async function deleteTransaction(id) {
    try {
      await axios.delete(`/api/transactions/${id}`);

      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error
      });
    }
  }

  async function addTransaction(transaction) {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const res = await axios.post('/api/transactions', transaction, config);

      dispatch({
        type: 'ADD_TRANSACTION',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error
      });
    }
  }


  return (<GlobalContext.Provider value={{
    loggedInEmail: state.loggedInEmail,  // TODO: is this right?
    transactions: state.transactions,
    error: state.error,
    loading: state.loading,
    getTransactions,
    addLoggedInEmail,
    getLoggedInEmail,
    deleteTransaction,
    addTransaction
  }}>
    {children}
  </GlobalContext.Provider>);
}