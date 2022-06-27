import React, { Fragment, useEffect } from "react";

import { observer } from "mobx-react";

import { Switch, Route } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Movie from "./components/Movie";

import reduxAuthStore from "./reduxAuthStore";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loadUser } from "./actions/authActions";

import { Container } from "reactstrap";
// the import order of these CSS files matters!
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.scss";

import { GlobalProvider } from "./context/GlobalState";
import { FilmProvider } from "./context/FilmState";
import { WatchedProvider } from "./context/WatchedState";
import { WatchedList } from "./components/WatchedList";

export const App = observer((props) => {
  useEffect(() => {
    console.log("App, useEffect called");

    const fetchUser = async () => {
      await reduxAuthStore.dispatch(loadUser());
      console.log("App, useEffect after loadUser");
      await props.homeStore.getPageResults(props.homeStore.currentPage, false);
      console.log(
        "App, useEffect after getPageResults, films.length:" +
          props.homeStore.films.length
      );
    };
    fetchUser();
  }, [props.isAuthenticated]);

  const changePage = (page, triggerRefresh) => {
    props.homeStore.currentPage = page;
    console.log("changePage, page:", page);
    props.homeStore.getPageResults(props.homeStore.currentPage, triggerRefresh);
    scrollTop();
  };

  const scrollTop = () => {
    window.scrollTo(0, 0);
  };

  const { pageResults, films, loaded } = props.homeStore;
  console.log("App, render, isAuthenticated:" + props.isAuthenticated);
  console.log("App, render, loaded:" + loaded);

  const authFilmLinks = (
    <Fragment>
      <GlobalProvider>
        <FilmProvider>
          <WatchedProvider>
            {!loaded ? null : props.isAuthenticated ? (
              <Switch>
                <Route exact path="/">
                  <Home changePage={changePage} scrollTop={scrollTop} />
                </Route>
                <Route exact path="/vintage">
                  <Home changePage={changePage} scrollTop={scrollTop} />
                </Route>
                <Route path={`/watched`}>
                  <WatchedList
                    changePage={changePage}
                    currentPage={props.homeStore.currentPage}
                  />
                </Route>
              </Switch>
            ) : null}

            <Switch>
              {
                console.log("Movie route in App.js called, loaded" + loaded)
                // Routes for Top 100 movies
              }
              {!loaded
                ? null
                : props.isAuthenticated
                ? pageResults.map((film) => (
                    <Route
                      path={`/movie/${film.movieDbId}`}
                      key={film.movieDbId}
                    >
                      <Movie id={film.movieDbId} scrollTop={scrollTop} />
                    </Route>
                  ))
                : null}
            </Switch>
          </WatchedProvider>
        </FilmProvider>
      </GlobalProvider>
    </Fragment>
  );

  if (loaded && props.isAuthenticated) {
    console.log("App, render, films.length:" + JSON.stringify(films.length));
  }
  return (
    <div className="relative">
      <Navigation />
      <AppNavbar
        changePage={changePage}
        currentPage={props.homeStore.currentPage}
      />

      <Container>
        {props.isAuthenticated ? authFilmLinks : "Login to view your films!"}
      </Container>
    </div>
  );
});

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

App.propTypes = {
  isAuthenticated: PropTypes.bool,
};

export default connect(mapStateToProps)(App);
