
import axios from 'axios';
import { returnErrors } from './errorActions';

import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from './types';

// Check token & load user
export const loadUser = () => (dispatch, getState) => {

  console.log ("authAction, getState1:" + JSON.stringify(getState));
  console.log ("authAction, getState1().auth:" + JSON.stringify(getState().auth));


  // User loading
  dispatch({ type: USER_LOADING });
  console.log ("authAction, loadUser, calling axios-api/auth/user");
  axios
    .get('/api/auth/user', tokenConfig(getState))
    .then(res => {
      console.log("loadUser...need to set email in context, res.data:" + JSON.stringify(res.data));
      const { email } = res.data;
      console.log("email:" + email);
      localStorage.setItem ('BRFemail', email);

      dispatch({
        type: USER_LOADED,
        payload: res.data
      })
      console.log ("authAction, getState2:" + JSON.stringify(getState));
      console.log ("authAction, getState2().auth:" + JSON.stringify(getState().auth));
    })
    .catch(err => {
      console.log("authAction, loadUser:" + err);
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};

// Register User
export const register = ({ name, email, password }) => dispatch => {

  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ name, email, password });
  console.log ("authAction, register, calling axios-/api/users");

  axios
    .post('/api/users', body, config)
    .then(res => {
      console.log("Successful return from register user, res.data" + JSON.stringify(res.data));
      console.log("res.data.user.email:" + res.data.user.email);
      // load the user's new films into our context
      console.log("getLoggedInEmail" + JSON.stringify(res.data.user.email));
      localStorage.setItem ('BRFemail', res.data.user.email);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      })
    })
    .catch(err => {
      console.log("authAction, register:" + err);
      dispatch(
        returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')
      );
      dispatch({
        type: REGISTER_FAIL
      });
    });
};

// Login User
export const login = ({ email, password }) => dispatch => {
  // Headers
  localStorage.setItem ('BRFemail', email);
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ email, password });

  console.log ("authAction, login, calling axios-api/auth");
  axios
    .post('/api/auth', body, config)
    .then(res => {
      console.log ("Successful login, res.data:" + JSON.stringify(res.data));

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      })
    })
    .catch(err => {
      console.log("authAction, login:" + err);

      dispatch(
        returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL')
      );
      dispatch({
        type: LOGIN_FAIL
      });
    });
};

// Logout User
export const logout = () => {
  localStorage.setItem ('BRFemail', '');
  return {
    type: LOGOUT_SUCCESS
  };
};

// Setup config/headers and token
export const tokenConfig = getState => {
  // Get token from localstorage
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  // If token, add to headers
  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
};
