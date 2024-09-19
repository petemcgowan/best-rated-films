import { observable, action, makeObservable, runInAction } from "mobx";

const html = document.querySelector("html");

// Store for fetching the Movies Page
class MovieStore {
  details = [];
  loaded = false;

  constructor() {
    // This replaces the `decorate` call
    makeObservable(this, {
      details: observable,
      loaded: observable,
      setDetails: action,
    });
  }

  fetchAll(id) {
    runInAction(() => {
      this.loaded = false;
    });
    const apiKey = process.env.REACT_APP_API_KEY;

    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits`
    )
      .then((res) => res.json())
      .then((res) => {
        const director = this.getDirector(res.credits.crew);

        return (
          this.setDetails({ ...res, director }),
          this.details
            ? (html.style.background = `url(https://image.tmdb.org/t/p/w1280${this.details.backdrop_path}) center center / cover no-repeat fixed`)
            : null
        );
      });
  }

  // New method to get director from the crew array
  getDirector(crew) {
    if (!crew || crew.length === 0) return null;

    // Find the director in the crew array
    const director = crew.find(member => member.job === 'Director');

    // If found, return the director's name, otherwise return null
    return director ? director.name : null;
  }

  setDetails(data) {
    this.details = data;
    this.loaded = true;
  }
}

let movieStore = new MovieStore();

export default movieStore;
