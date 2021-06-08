import React, { Component, Fragment } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Container,
} from "reactstrap";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import RegisterModal from "./auth/RegisterModal";
import LoginModal from "./auth/LoginModal";
import Logout from "./auth/Logout";
import logo from "../images/best rated_logo_rgb_dark_white.png";

import { GlobalProvider } from "../context/GlobalState";
import { FilmProvider } from "../context/FilmState";
import { WatchedProvider } from "../context/WatchedState";
import { FilmList } from "./FilmList";
import { WatchedList } from "./WatchedList";
// import { FilmContext } from "../context/FilmState";

class AppNavbar extends Component {
  state = {
    isOpen: false,
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const authFilmLinks = (
      <Fragment>
        <GlobalProvider>
          <FilmProvider>
            <WatchedProvider>
              <FilmList />
              {/*  <Switch>
                <Route exact path="/"></Route>
                 popular.results.map((i) => (
                <Route path={`/movie/${i.id}`} key={i.id}>
                  <Movie id={i.id} scrollTop={this.scrollTop} />
                </Route>
                ))
              </Switch>*/}
              <WatchedList />
            </WatchedProvider>
          </FilmProvider>
        </GlobalProvider>
      </Fragment>
    );

    const authLinks = (
      <Fragment>
        <NavItem>
          <span className="navbar-text mr-3">
            <strong>{user ? `Welcome ${user.name}` : ""}</strong>
          </span>
        </NavItem>
        <NavItem>
          <Logout />
        </NavItem>
        <div className="container"></div>
      </Fragment>
    );

    const guestLinks = (
      <Fragment>
        <NavItem>
          <RegisterModal />
        </NavItem>
        <NavItem>
          <LoginModal />
        </NavItem>
      </Fragment>
    );

    return (
      <div
        style={{
          backgroundColor: "black",
        }}
      >
        <Navbar color="dark" dark expand="sm" className="mb-5">
          <Container>
            <NavbarBrand href="/">
              <img
                src={logo}
                width="138"
                height="64"
                className="d-inline-block align-top"
                alt="Best Rated Films logo"
              />
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                {isAuthenticated ? authLinks : guestLinks}
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <Container>
          {isAuthenticated ? authFilmLinks : "Login to view your films!"}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(AppNavbar);
