import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("BRFtoken"),
  email: localStorage.getItem("BRFemail"),
  isAuthenticated: null,
  isLoading: false,
  user: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      console.log(
        "authReducer, LOGIN_SUCCESS, action.payload:" +
          JSON.stringify(action.payload)
      );
      console.log(
        "authReducer, LOGIN_SUCCESS, action.payload.token:" +
          action.payload.token
      );
      localStorage.setItem("BRFtoken", action.payload.token);
      console.log(
        "authReducer, LOGIN_SUCCESS, SETTING LS EMAIL" +
          action.payload.user.email
      );
      localStorage.setItem("BRFemail", action.payload.user.email);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem("BRFtoken");
      localStorage.removeItem("BRFemail");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}
