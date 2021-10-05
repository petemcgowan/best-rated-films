import React from "react";
import { observer } from "mobx-react";
import homeStore from "../store/HomeStore";
import Pagination from "rc-pagination";
import { FilmDetails2 } from "./FilmDetails2";

const PageResults = observer((props) => {
  const { pageResults, films, loaded, currentPage } = homeStore;
  const { changePage, scrollTop } = props;

  return (
    <section>
      {loaded ? (
        <div className="movies-grid">
          {pageResults.map((film) => {
            return (
              <FilmDetails2
                film={film}
                key={film._id}
                scrollTop={scrollTop}
                changePage={changePage}
                currentPage={currentPage}
              />
            );
          })}
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
});

export default PageResults;
