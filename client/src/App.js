import React, { Fragment, useEffect } from "react";

import { observer } from "mobx-react";

import { Switch, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Movie from "./components/Movie";
import About from "./components/About";
import TopTabBar from "./components/TopTabBar";

import reduxAuthStore from "./reduxAuthStore";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loadUser } from "./actions/authActions";

import { Container } from "reactstrap";
// the import order of these CSS files matters
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.scss";
import './App2.css'

import { GlobalProvider } from "./context/GlobalState";
import { FilmProvider } from "./context/FilmState";
import { WatchedProvider } from "./context/WatchedState";
import { WatchedList } from "./components/WatchedList";

export const App = observer((props) => {
  useEffect(() => {
    const fetchUser = async () => {
      await reduxAuthStore.dispatch(loadUser());
      await props.homeStore.getPageResults(props.homeStore.currentPage, false);
    };
    fetchUser();
  }, [props.isAuthenticated, props.homeStore]);

  const changePage = (page, triggerRefresh) => {
    props.homeStore.currentPage = page;
    props.homeStore.getPageResults(props.homeStore.currentPage, triggerRefresh);
    scrollTop();
  };

  const scrollTop = () => {
    window.scrollTo(0, 0);
  };

  const { pageResults, films, loaded } = props.homeStore;

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
                <Route path={`/about`}>
                  <About
                    changePage={changePage}
                    currentPage={props.homeStore.currentPage}
                  />
                </Route>
              </Switch>
            ) :               <Switch>
                <Route path={`/about`}>
                  <About
                  />
                </Route>
              </Switch>}

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

  return (
    <div className="App">
      <TopTabBar isAuthenticated={props.isAuthenticated}
        toggleVintage={props.toggleVintage}
        toggleWatched={props.toggleWatched}
        changePage={changePage}
      />
      <Navigation />
      {/* <BasicCenteredMenu/> */}
      {/* <AppNavbar
        changePage={changePage}
        currentPage={props.homeStore.currentPage}
      /> */}

      <div>
        {props.isAuthenticated ? authFilmLinks : authFilmLinks}
      </div>
      {/* <Container>
        {props.isAuthenticated ? authFilmLinks : "Login to view your films!"}
      </Container> */}
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
