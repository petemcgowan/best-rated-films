export default (state, action) => {
  switch (action.type) {
    case "GET_MOVIE_DETAILS":
      return {
        ...state,
        loading: false,
        movieDetails: action.payload,
      };
    case "MOVIE_DETAIL_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
