import React, { createContext, useReducer } from "react";
import WatchedReducer from "./WatchedReducer";
import axios from "axios";
import { getEmail } from "../utils/helpers";

// Initial state
const initialState = {
  watched: [],
  error: null,
  loading: true,
};

// Create context
export const WatchedContext = createContext(initialState);

// Provider component
export const WatchedProvider = ({ children }) => {
  const [state, dispatch] = useReducer(WatchedReducer, initialState);

  async function getWatched() {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        "/api/watched",
        { email: getEmail() },
        config
      );

      dispatch({
        type: "GET_WATCHED",
        payload: res.data.data,
      });
    } catch (err) {
      console.error("getWatched, err:" + err);
      dispatch({
        type: "WATCHED_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  async function deleteWatched(id) {
    try {
      await axios.delete(`/api/watched/${id}`);

      dispatch({
        type: "DELETE_WATCHED",
        payload: id,
      });
    } catch (err) {
      console.error("deleteWatched, err:" + err);
      dispatch({
        type: "WATCHED_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  async function addWatched(title, email) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(
        "/api/watched/addWatched",
        { title, email },
        config
      );

      dispatch({
        type: "ADD_WATCHED",
        payload: res.data.data,
      });
    } catch (err) {
      console.error("addWatched, err:" + err);
      dispatch({
        type: "WATCHED_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  return (
    <WatchedContext.Provider
      value={{
        watched: state.watched,
        error: state.error,
        loading: state.loading,
        getWatched,
        addWatched,
        deleteWatched,
      }}
    >
      {children}
    </WatchedContext.Provider>
  );
};
