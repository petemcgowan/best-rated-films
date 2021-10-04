import { observable, action, decorate, runInAction } from "mobx";
import axios from "axios";

import { getEmail } from "../utils/helpers";
const html = document.querySelector("html");

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

let random = randomNumber(0, 20);

class HomeStore {
  pageResults = [];
  films = [];
  loaded = false;
  currentPage = 1;
  vintageMode = false;

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
      console.log("HomeStore, fetchFilms has been called");

      console.log("HomeStore, fetchFilms, getEmail():" + getEmail());
      const res = await axios.post(
        `/api/films`,
        { email: getEmail(), vintageMode: this.vintageMode },
        config
      );

      this.setFilms(res.data.data);
    } catch (err) {
      console.log("fetchFilms, errr:" + err);
    }
  }

  async getPageResults(page, triggerRefresh) {
    runInAction(() => {
      this.loaded = false;
    });

    console.log("HomeStore, getPageResults, films.length:" + this.films.length);
    console.log("HomeStore, getPageResults, triggerRefresh:" + triggerRefresh);

    this.pageResults = [];

    if (
      this.films === null ||
      this.films === undefined ||
      this.films.length === 0 ||
      triggerRefresh // we want the films straight from the DB
    ) {
      console.log(
        "HomeStore, getPageResults has no films, so it's getting them"
      );
      await this.fetchFilms(this.vintageMode);
    }

    // clear this array everytime
    console.log("HomeStore, getPageResults, page:" + page);
    // TODO: this is gonna be an issue when you run out of films*20 and there's like 12 left or such (put a check in so the max checks against what's left vs page etc).
    const pageFilmStart = (page - 1) * 20; // 20, 40, 60
    let pageFilmEnd = page * 20; // 20, 40, 60
    if (pageFilmEnd > this.films.length) pageFilmEnd = this.films.length;
    console.log(
      "HomeStore, getPageResults, pageFilmStart:" +
        pageFilmStart +
        ", pageFilmEnd:" +
        pageFilmEnd +
        ", this.films.length:" +
        this.films.length
    );

    for (let index = pageFilmStart; index < pageFilmEnd; index++) {
      this.pageResults.push(this.films[index]);
    }

    return (
      this.setPageResults(this.pageResults),
      this.pageResults[random]
        ? (html.style.background = `url(https://image.tmdb.org/t/p/w1280${this.pageResults[random].backdrop_path})
        center center / cover no-repeat fixed`)
        : null
    );
  }

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

  setFilms(data) {
    this.films = data;
  }

  setPageResults(data) {
    this.pageResults = data;
    this.loaded = true;
  }
}

decorate(HomeStore, {
  pageResults: observable,
  films: observable,
  currentPage: observable,
  vintageMode: observable,
  setFilms: action,
  setPageResults: action,
  loaded: observable,
});

const homeStore = new HomeStore();

export default homeStore;
