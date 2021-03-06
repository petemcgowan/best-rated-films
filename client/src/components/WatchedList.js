import React, { useContext, useEffect } from 'react';
import { WatchedDetails }  from './WatchedDetails';
import { WatchedContext } from '../context/WatchedState';

export const WatchedList = () => {
  const { watched, getWatched } = useContext(WatchedContext);

  useEffect(() => {
    getWatched();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h3>Already Watched</h3>
      <ul className="list">
      {watched.map(watchedFilm => {
        console.log ("WatchedList, watchedFilm:" + JSON.stringify(watchedFilm));
        return (<WatchedDetails watchedFilm={watchedFilm} key={watchedFilm._id}  />)
      })}
      </ul>
    </>
  )
}
