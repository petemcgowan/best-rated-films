import React, { Component, Fragment } from "react";
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
import { WatchedProvider } from "./context/WatchedState";
import { FilmList } from "./components/FilmList";
import { WatchedList } from "./components/WatchedList";
// import { FilmContext } from "./context/FilmState";

const App = observer(
  class extends Component {
    static propTypes = {
      isAuthenticated: PropTypes.bool,
    };

    componentDidMount() {
      console.log("Main App, useEffect called");
      const fetchUser = async () => {
        await store.dispatch(loadUser());
      };
      fetchUser();

      console.log("top100:", this.props.homeStore.top100);
      // this.props.homeStore.fetchFilms();
      this.props.homeStore.fetchTopFilms(this.props.homeStore.currentPage);
    }

    changePage = (page) => {
      this.props.homeStore.currentPage = page;
      console.log("changePage, page:", page);
      console.log("changePage, page:", page);
      this.props.homeStore.fetchTopFilms(this.props.homeStore.currentPage);
      this.scrollTop();
    };

    scrollTop = () => {
      window.scrollTo(0, 0);
    };

    render() {
      const { top100, films, loaded } = this.props.homeStore;
      console.log("App, render, isAuthenticated:" + this.props.isAuthenticated);
      console.log("App, render, loaded:" + loaded);

      const authFilmLinks = (
        <Fragment>
          <GlobalProvider>
            <FilmProvider>
              <WatchedProvider>
                <FilmList />
                {/* <Switch>
                  <Route exact path="/"></Route>
                   top100.results.map((i) => (
                  <Route path={`/movie/${i.id}`} key={i.id}>
                    <Movie id={i.id} scrollTop={this.scrollTop} />
                  </Route>
                  ))
                </Switch> */}
                <WatchedList />
              </WatchedProvider>
            </FilmProvider>
          </GlobalProvider>
        </Fragment>
      );

      if (loaded && this.props.isAuthenticated) {
        // console.log("App, render, top100:" + JSON.stringify(top100));
        // console.log("App, render, films:" + JSON.stringify(films));
        console.log(
          "App, render, top100.results.length:" +
            JSON.stringify(top100.results.length)
        );
        console.log(
          "App, render, films.length:" + JSON.stringify(films.length)
        );
      }
      return (
        <div className="relative">
          {/* Redux store */}
          <Navigation clearSearch={this.clearSearch} />
          <AppNavbar />
          {!loaded ? null : this.props.isAuthenticated ? (
            <Switch>
              <Route exact path="/">
                <Home changePage={this.changePage} scrollTop={this.scrollTop} />
              </Route>
            </Switch>
          ) : null}

          <Switch>
            {
              // Routes for Top 100 movies
            }
            {!loaded
              ? null
              : this.props.isAuthenticated
              ? top100.results.map((film) => (
                  <Route path={`/movie/${film.id}`} key={film.id}>
                    <Movie id={film.id} scrollTop={this.scrollTop} />
                  </Route>
                ))
              : null}
          </Switch>

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
