import { top20 } from "../data/top20";
import { observable, action, decorate, runInAction } from "mobx";
import axios from "axios";
const html = document.querySelector("html");

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

let random = randomNumber(0, 20);

class HomeStore {
  top100 = [];
  films = [];
  loaded = false;
  currentPage = 1;

  calcAverageRankingField(films) {
    // Average Ranking calculations
    var cumulativeRanking = 0;
    var rankingOccurrences = 0;

    films.forEach((film) => {
      film.rankings.map((data, key) => {
        if (
          data.rank !== undefined &&
          data.rank.toLowerCase() !== "todo" &&
          data.ranker.toLowerCase() !== "other"
        ) {
          cumulativeRanking += Number(data.rank);
          rankingOccurrences++;
        }
        return data.rank;
      });
      var averageRanking = (cumulativeRanking / rankingOccurrences).toFixed(2);
      film["averageRanking"] = averageRanking;
    });

    // // Sort by average ranking
    function sortJSONArrayByAverageRanking(film1, film2) {
      return film1.averageRanking - film2.averageRanking;
    }
    films.sort(sortJSONArrayByAverageRanking);
  }

  async fetchFilms() {
    runInAction(() => {
      this.loaded = false;
    });

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("fetchFilms");
      const res = await axios.post(
        `/api/films`,
        { email: "May28B@gmail.com" },
        config
      );
      this.calcAverageRankingField(res.data.data);
      // console.log("fetchFilms, res.data.data" + JSON.stringify(res.data.data));
      this.setFilms(res.data.data);

      // calcAverageRankingField(res.data.data);
    } catch (err) {
      console.log("getFilms, errr:" + err);
    }
  }

  async fetchTopFilms(page) {
    runInAction(() => {
      this.loaded = false;
    });
    // For our 20 ids, call the Movie API 20 times, and then make the results set to be the same way aka page and all that.  The 2nd stage would be actualy retrieving the IDS from our films array.  3rd, order the films by averageRanking.  4th use the page mechanism in all cases.
    let topFilmsArray = {
      page: page,
      results: [],
      total_pages: 500,
      total_results: 10000,
    };
    let results = [];
    const apiKey = "4e182d5acda98a333464c4252dc9c195";

    await this.fetchFilms();
    // const arrayOfMovieDbIds = [
    //   348, 857, 13, 194, 1091, 62, 28, 578, 261909, 792, 603, 680, 769, 443129,
    //   238, 1578, 240, 510, 840, 15,
    // ];

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // clear this array everytime
    console.log("fetchTopFilms, page:" + page);
    // TODO: this is gonna be an issue when you run out of films*20 and there's like 12 left or such (put a check in so the max checks against what's left vs page etc).
    const pageFilmStart = (page - 1) * 20; // 20, 40, 60
    let pageFilmEnd = page * 20; // 20, 40, 60
    if (pageFilmEnd > this.films.length) pageFilmEnd = this.films.length;
    console.log(
      "fetchTopFilms, pageFilmStart:" +
        pageFilmStart +
        ", pageFilmEnd:" +
        pageFilmEnd +
        ", this.films.length:" +
        this.films.length
    );
    // console.log("this.films.results:" + JSON.stringify(this.films));
    for (let index = pageFilmStart; index < pageFilmEnd; index++) {
      // console.log("this.films[index]:" + JSON.stringify(this.films[index]));
      const movieDbId = this.films[index].movieDbId;
      const averageRanking = this.films[index].averageRanking;
      // console.log("averageRanking:" + JSON.stringify(averageRanking));
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieDbId}?api_key=${apiKey}&language=en-US`,
        config
      );
      response.data.averageRanking = averageRanking;
      results.push(response.data);
      // console.log(
      //   "fetchTopFilms, response.data:" + JSON.stringify(response.data)
      // );
    }

    // console.log("results:" + JSON.stringify(results));
    topFilmsArray.results = results;
    // console.log("topFilmsArray after:" + JSON.stringify(topFilmsArray));

    return (
      this.setTop100(topFilmsArray),
      this.top100.results[random]
        ? (html.style.background = `url(https://image.tmdb.org/t/p/w1280${this.top100.results[random].backdrop_path})
        center center / cover no-repeat fixed`)
        : null
    );
  }

  fetchTop100(page) {
    runInAction(() => {
      this.loaded = false;
    });
    const apiKey = "4e182d5acda98a333464c4252dc9c195";

    // Pete todo obviously this will be replaced with the "20 array loop"
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`
    )
      .then((res) => res.json())
      .then((res) => {
        return (
          this.setTop100(top20),
          this.top100.results[random]
            ? (html.style.background = `url(https://image.tmdb.org/t/p/w1280${this.top100.results[random].backdrop_path})
            center center / cover no-repeat fixed`)
            : null
        );
      });
  }

  setFilms(data) {
    this.films = data;
  }

  setTop100(data) {
    this.top100 = data;
    this.loaded = true;
  }
}

decorate(HomeStore, {
  top100: observable,
  films: observable,
  search: observable,
  currentPage: observable,
  term: observable,
  setFilms: action,
  setTop100: action,
  setSearch: action,
  loaded: observable,
});

const homeStore = new HomeStore();

export default homeStore;
