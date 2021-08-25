import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";
import reduxAuthStore from "../reduxAuthStore";

// Initial state
const initialState = {
  loggedInEmail: null,
  error: null,
  loading: true,
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  async function getLoggedInEmail() {
    try {
      const state = reduxAuthStore.getState();
      var email = "";
      if (state.user != null) {
        email = state.user.email;
      }
      console.log("getLoggedInEmail, state" + JSON.stringify(state));
      console.log("getLoggedInEmail, state.user" + JSON.stringify(state.user));
      return email;
    } catch (err) {
      dispatch({
        type: "GLOBAL_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  // Actions
  async function addLoggedInEmail(email) {
    try {
      dispatch({
        type: "ADD_LOGGED_IN_EMAIL",
        payload: email,
      });
    } catch (err) {
      dispatch({
        type: "GLOBAL_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        loggedInEmail: state.loggedInEmail, // TODO: is this right?
        error: state.error,
        loading: state.loading,
        addLoggedInEmail,
        getLoggedInEmail,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
