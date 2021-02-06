export default (state, action) => {
  switch(action.type) {
    case 'GET_FILMS':
      return {
        ...state,
        loading: false,
        films: action.payload
      }
    case 'DELETE_FILM': {
      console.log("Reducer, DELETE_FILM, action.payload(should be id):" + JSON.stringify(action.payload));
      return {
        ...state,
        films: state.films.filter(film => film._id !== action.payload)
      }
    }
    case 'ADD_FILM':
      console.log("Reducer, ADD_FILM, action.payload:" + JSON.stringify(action.payload));
      return {
        ...state,
        films: [...state.films, action.payload]
      }
    case 'FILM_ERROR':
      console.log("Reducer, FILM_ERROR, action.payload:" + JSON.stringify(action.payload));
      return {
        ...state,
        error: action.payload
      }
    default:
      return state;
  }
}
