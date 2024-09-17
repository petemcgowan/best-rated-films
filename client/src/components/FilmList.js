import React, { useContext, useEffect } from "react";
import { FilmDetails } from "./FilmDetails";
import { FilmContext } from "../context/FilmState";
import '../styles/filmlist.scss'

export const FilmList = () => {
  const { films, getFilms } = useContext(FilmContext);

  useEffect(() => {
    const fetchData = async () => {
      await getFilms(true);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return films.length ? (
    <div id="table-wrapper">
      <div id="table-scroll">
        <div className="film-list">
          <table>
            <thead>
              <tr>
                <th>Film</th>
                <th>AFI</th>
                <th>Empire</th>
                <th>IMDB</th>
                <th>Hollywood Reporter</th>
                <th>Average Ranking</th>
              </tr>
            </thead>
            <tbody>
              {films.map((film) => {
                return <FilmDetails film={film} key={film._id} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <div className="empty">No films to ogle.</div>
  );
};
