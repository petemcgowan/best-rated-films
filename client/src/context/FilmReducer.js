export default (state, action) => {
  switch (action.type) {
    case "GET_FILMS":
      return {
        ...state,
        loading: false,
        films: action.payload,
      };
    case "DELETE_FILM": {
      return {
        ...state,
        films: state.films.filter((film) => film._id !== action.payload),
      };
    }
    case "ADD_FILM":
      return {
        ...state,
        films: [...state.films, action.payload],
      };
    case "SET_CURRENT_PAGE":
      return {
        ...state,
        currentPage: [...state.currentPage, action.payload],
      };
    case "SET_TOP100":
      return {
        ...state,
        top100: [...state.top100, action.payload],
      };
    case "SET_MOVIE_DETAILS":
      // finding index of the item
      // const index = state.films.findIndex(
      //   (film) => film.filmId == action.payload.filmId
      // );
      let indexFound = -1;
      // );
      for (let index = 0; index < state.films.length; index++) {
        if (state.films[index].filmId === action.payload.filmId) {
          console.log("FOUND!!:" + state.films[index].filmId);
          indexFound = index;
          break;
        }
      }

      const newArray = [...state.films]; //making a new array
      //changing values in the new array
      newArray[indexFound].movieDbId = action.payload.movieDbId;
      newArray[indexFound].poster_path = action.payload.poster_path;
      newArray[indexFound].release_date = action.payload.release_date;
      newArray[indexFound].backdrop_path = action.payload.backdrop_path;

      return {
        ...state, //copying the original state
        films: newArray, //reassingning films to new array
      };
    case "FILM_ERROR":
      console.log(
        "Reducer, FILM_ERROR, action.payload:" + JSON.stringify(action.payload)
      );
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
