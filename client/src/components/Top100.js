import React, { Component } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import homeStore from "../store/HomeStore";
import Pagination from "rc-pagination";
import { FilmContext } from "../context/FilmState";
import { WatchedContext } from "../context/WatchedState";

const nullw500 = require("../images/nullw500.png");

const Top100 = observer(
  class extends Component {
    static filmContextType = FilmContext;
    static watchedContextType = WatchedContext;

    constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
      // this.watchedContextType = this.watchedContextType.bind(this);
      // this.filmContextType = this.filmContextType.bind(this);
      // this.watchedContextType.deleteFilm =
      //   this.watchedContextType.deleteFilm.bind(this);
      // this.filmContextType.addWatched =
      //   this.filmContextType.addWatched.bind(this);
    }

    handleClick(filmId, title, email) {
      console.log("this is:", this);
      console.log(
        "handleClick, filmId:" +
          filmId +
          ", title:" +
          title +
          ", email:" +
          email
      );

      this.filmContextType.deleteFilm(filmId);
      this.watchedContextType.addWatched(title, email);
    }

    render() {
      const { top100, films, loaded, currentPage } = homeStore;
      const { changePage, scrollTop } = this.props;

      return (
        <section>
          {loaded ? (
            <div className="movies-grid">
              {top100.results.map(
                ({
                  movieDbId,
                  poster_path,
                  title,
                  release_date,
                  averageRanking,
                  filmId,
                  email,
                }) => (
                  <div className="movie-item infos-container" key={movieDbId}>
                    <Link to={`/movie/${movieDbId}`} onClick={scrollTop}>
                      <img
                        src={
                          poster_path
                            ? `https://image.tmdb.org/t/p/w500${poster_path}`
                            : `${nullw500}`
                        }
                        alt={`Movie Poster`}
                      />
                      <div className="infos-box">
                        <div className="infos-one">{release_date}</div>
                        <div className="infos-two">{title}</div>
                        <div className="infos-three">{averageRanking}</div>
                      </div>
                    </Link>
                    <div>
                      <button
                        onClick={() => this.handleClick(filmId, title, email)}
                      >
                        Watched
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="loading">Loading...</div>
          )}
          <div className="paginator">
            <Pagination
              total={films.length}
              current={currentPage}
              pageSize={20}
              onChange={changePage}
            />
          </div>
        </section>
      );
    }
  }
);

export default Top100;
