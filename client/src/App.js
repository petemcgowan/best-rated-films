import React, { Component, Fragment, useContext } from "react";
import { observer } from "mobx-react";
import { Switch, Route } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Movie from "./components/Movie";
import store from "./store";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loadUser } from "./actions/authActions";
import { Container } from "reactstrap";

// the import order of these CSS files matters!
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.scss";

import { GlobalProvider } from "./context/GlobalState";
import { FilmProvider } from "./context/FilmState";
// import { FilmList } from "./components/FilmList";
import { WatchedProvider } from "./context/WatchedState";
import { WatchedList } from "./components/WatchedList";

// const { setMovieDetails } = useContext(FilmContext);

const App = observer(
  class extends Component {
    static propTypes = {
      isAuthenticated: PropTypes.bool,
    };

    componentDidMount() {
      console.log("Main App, useEffect called");

      const fetchUser = async () => {
        await store.dispatch(loadUser());
        await this.props.homeStore.getPageResults(
          this.props.homeStore.currentPage,
          false
        );
      };
      fetchUser();

      // console.log("top100:", this.props.homeStore.top100);
      // this.props.homeStore.fetchFilms();
      // if (this.props.isAuthenticated)
      // console.log("App, RETURNED FROM getPageResults");
      // let films = this.props.homeStore.top100;
      // for (let index = 0; index < 217; index++) {
      //   console.log("this.films[index]:" + JSON.stringify(films[index]));
      //   let film = films[index];
      //   console.log(
      //     "HomeStore, movieDbId:" +
      //       film.movieDbId +
      //       ", film.filmId:" +
      //       film.filmId +
      //       ", poster_path:" +
      //       film.poster_path +
      //       ", release_date:" +
      //       film.release_date +
      //       ", backdrop_path:" +
      //       film.backdrop_path
      //   );
      //   this.contextType.setMovieDetails(
      //     film.filmId, // film id (not films to watch id)
      //     film.movieDbId,
      //     film.poster_path,
      //     film.release_date,
      //     film.backdrop_path
      //   );
      // }
    }

    changePage = (page, triggerRefresh) => {
      this.props.homeStore.currentPage = page;
      console.log("changePage, page:", page);
      this.props.homeStore.getPageResults(
        this.props.homeStore.currentPage,
        triggerRefresh
      );
      this.scrollTop();
    };

    scrollTop = () => {
      window.scrollTo(0, 0);
    };

    render() {
      const { pageResults, films, loaded } = this.props.homeStore;
      console.log("App, render, isAuthenticated:" + this.props.isAuthenticated);
      console.log("App, render, loaded:" + loaded);

      const authFilmLinks = (
        <Fragment>
          <GlobalProvider>
            <FilmProvider>
              <WatchedProvider>
                {!loaded ? null : this.props.isAuthenticated ? (
                  <Switch>
                    <Route exact path="/">
                      <Home
                        changePage={this.changePage}
                        scrollTop={this.scrollTop}
                      />
                    </Route>
                    <Route exact path="/vintage">
                      <Home
                        changePage={this.changePage}
                        scrollTop={this.scrollTop}
                      />
                    </Route>
                    <Route path={`/watched`}>
                      <WatchedList
                        changePage={this.changePage}
                        currentPage={this.currentPage}
                      />
                    </Route>
                  </Switch>
                ) : null}

                {/* <Switch>
                {
                  // Route for Watched page
                }
                {isAuthenticated ? (
                  <Route path={`/watched`}>
                      <WatchedList
                        changePage={changePage}
                        currentPage={currentPage}
                      />
                  </Route>
                ) : null}
              </Switch> */}

                <Switch>
                  {
                    // Routes for Top 100 movies
                  }
                  {!loaded
                    ? null
                    : this.props.isAuthenticated
                    ? pageResults.map((film) => (
                        <Route
                          path={`/movie/${film.movieDbId}`}
                          key={film.movieDbId}
                        >
                          <Movie
                            id={film.movieDbId}
                            scrollTop={this.scrollTop}
                          />
                        </Route>
                      ))
                    : null}
                </Switch>

                {/* <FilmList /> */}
                {/* <Switch>
                  <Route exact path="/"></Route>
                   pageResults.map((i) => (
                  <Route path={`/movie/${i.id}`} key={i.id}>
                    <Movie id={i.id} scrollTop={this.scrollTop} />
                  </Route>
                  ))
                </Switch> */}
                {/* <WatchedList
                  changePage={this.changePage}
                  currentPage={this.props.homeStore.currentPage}
                /> */}
              </WatchedProvider>
            </FilmProvider>
          </GlobalProvider>
        </Fragment>
      );

      if (loaded && this.props.isAuthenticated) {
        // console.log("App, render, top100:" + JSON.stringify(top100));
        // console.log("App, render, films:" + JSON.stringify(films));
        // console.log(
        //   "App, render, top100.results.length:" +
        //     JSON.stringify(top100.results.length)
        // );
        console.log(
          "App, render, films.length:" + JSON.stringify(films.length)
        );
      }
      return (
        <div className="relative">
          {/* Redux store */}
          <Navigation clearSearch={this.clearSearch} />
          <AppNavbar
            changePage={this.changePage}
            currentPage={this.props.homeStore.currentPage}
          />

          <Container>
            {this.props.isAuthenticated
              ? authFilmLinks
              : "Login to view your films!"}
          </Container>
        </div>
      );
    }
  }
);

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(App);
