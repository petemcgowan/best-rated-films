import React, { useEffect } from "react";
import { observer } from "mobx-react";
import movieStore from "../store/MovieStore";
import "../styles/movie.scss";

const nullw500 = require("../images/nullw500.png");

export const Movie = observer((props) => {
  useEffect(() => {
    console.log("Movie, componentDidMount:" + JSON.stringify(props));
    movieStore.fetchAll(props.id);
  }, []);

  const { loaded, details } = movieStore;
  console.log("loaded:" + JSON.stringify(loaded));
  console.log("details:" + JSON.stringify(details));
  return (
    <div className="relative">
      {loaded && details.length !== 0 ? (
        <>
          <div className="movie-grid">
            <div className="movie-poster">
              <img
                src={
                  details.poster_path
                    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                    : `${nullw500}`
                }
                alt="Movie poster"
              />
            </div>
            <div className="infos-grid">
              <div className="movie-title relative">{details.title}</div>
              <div className="movie-infos">
                <span className="movie-date">{details.release_date}</span>
                <span className="movie-vote">{details.vote_average}</span>
                <span className="movie-runtime">
                  {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                </span>
              </div>
              <div className="movie-genres">
                {details.genres
                  ? details.genres.map(({ id, name }, i) => (
                      <span key={id}>
                        {i !== details.genres.length - 1
                          ? `${name}, `
                          : ` ${name}`}
                      </span>
                    ))
                  : null}
              </div>
              <div className="movie-tagline">
                {details.tagline ? details.tagline : null}
              </div>

              <div className="movie-overview">{details.overview}</div>
              <div className="movie-director">
                <span className="director-job">Director</span>
                <span className="director-name">dummy Director</span>
              </div>
            </div>
            <div className="details-grid">
              <div className="title">Movie Facts</div>
              <div className="details-container">
                <div className="details-title">Original Title</div>
                <div className="details-value">{details.original_title}</div>
              </div>
              <div className="details-container">
                <div className="details-title">Status</div>
                <div className="details-value">
                  {details.status ? details.status : "Unknown"}
                </div>
              </div>
              <div className="details-container">
                <div className="details-title">Release Date</div>
                <div className="details-value">
                  {details.release_date ? details.release_date : "-"}
                </div>
              </div>
              <div className="details-container">
                <div className="details-title">Ratings</div>
                <div className="details-value">
                  {details.vote_average ? details.vote_average : "-"}
                </div>
              </div>
              <div className="details-container">
                <div className="details-title">Runtime</div>
                <div className="details-value">
                  {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                </div>
              </div>
              <div className="details-container">
                <div className="details-title">Budget</div>
                <div className="details-value">
                  $
                  {details.budget
                    ? details.budget
                        .toFixed(1)
                        .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    : "-"}
                </div>
              </div>
              <div className="details-container">
                <div className="details-title">Revenue</div>
                <div className="details-value">
                  $
                  {details.revenue
                    ? details.revenue
                        .toFixed(1)
                        .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="loading">Loading</div>
      )}
    </div>
  );
});

export default Movie;
