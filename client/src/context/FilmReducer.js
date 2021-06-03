export default (state, action) => {
  switch (action.type) {
    case "GET_FILMS":
      return {
        ...state,
        loading: false,
        films: action.payload,
      };
    case "DELETE_FILM": {
      console.log(
        "Reducer, DELETE_FILM, action.payload(should be id):" +
          JSON.stringify(action.payload)
      );
      return {
        ...state,
        films: state.films.filter((film) => film._id !== action.payload),
      };
    }
    case "ADD_FILM":
      console.log(
        "Reducer, ADD_FILM, action.payload:" + JSON.stringify(action.payload)
      );
      return {
        ...state,
        films: [...state.films, action.payload],
      };
    case "UPDATE_MOVIE_DB_ID":
      console.log(
        "Reducer, UPDATE_MOVIE_DB_ID, action.payload:" +
          JSON.stringify(action.payload)
      );

      // finding index of the item
      // const index = state.films.findIndex(
      //   (film) => film.filmId == action.payload.filmId
      // );
      let indexFound = -1;
      // console.log("TYPE: action.payload.filmId" + typeof action.payload.filmId);
      // console.log("OUTPUT: action.payload.filmId" + action.payload.filmId);
      // console.log(
      //   "STRINGY: action.payload.filmId" + JSON.stringify(action.payload.filmId)
      // );
      for (let index = 0; index < state.films.length; index++) {
        // console.log(
        //   "film.filmId:" +
        //     JSON.stringify(state.films[index].filmId) +
        //     ", TYPE:" +
        //     typeof state.films[index].filmId
        // );
        if (state.films[index].filmId === action.payload.filmId) {
          console.log("FOUND!!:" + state.films[index].filmId);
          indexFound = index;
          break;
        }
      }

      // console.log("indexFound:" + JSON.stringify(indexFound));
      const newArray = [...state.films]; //making a new array
      // console.log("newArray:" + JSON.stringify(newArray));

      // Pete TODO: I've forgotten what the payload is at this point!! ID or movieID FFS... (so I'm just hardcoding to 1 for now, as this isn't even needed theoretically).
      newArray[indexFound].movieDbId = action.payload.movieDbId; //changing value in the new array
      // console.log("newArray AFTER:" + JSON.stringify(newArray));

      return {
        ...state, //copying the orignal state
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
