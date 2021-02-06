export default (state, action) => {
  switch(action.type) {
    case 'GET_WATCHED':
      return {
        ...state,
        loading: false,
        watched: action.payload
      }
    case 'DELETE_WATCHED':
      return {
        ...state,
        watched: state.watched.filter(watchedFilm => watchedFilm._id !== action.payload)
      }
    case 'ADD_WATCHED':
      return {
        ...state,
        watched: [...state.watched, action.payload]
      }
    case 'WATCHED_ERROR':
      return {
        ...state,
        error: action.payload
      }
    default:
      return state;
  }
}
