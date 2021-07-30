import { observable, action, decorate, runInAction } from "mobx";

const html = document.querySelector("html");

// Store for fetching the Movies Page
class MovieStore {
  details = [];
  loaded = false;

  fetchAll(id) {
    runInAction(() => {
      this.loaded = false;
    });
    console.log("fetchAll");
    const apiKey = "4e182d5acda98a333464c4252dc9c195";

    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log("res" + JSON.stringify(res));
        return (
          this.setDetails(res),
          this.details
            ? (html.style.background = `url(https://image.tmdb.org/t/p/w1280${this.details.backdrop_path})
                center center / cover no-repeat fixed`)
            : null
        );
      });
  }

  setDetails(data) {
    this.details = data;
    this.loaded = true;
  }
}

decorate(MovieStore, {
  details: observable,
  loaded: observable,
  setDetails: action,
});

let movieStore = new MovieStore();

export default movieStore;
