import React, { Fragment, useState, useEffect } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
} from "reactstrap";
import { connect } from "react-redux";
import homeStore from "../store/HomeStore";
import PropTypes from "prop-types";
import RegisterModal from "./auth/RegisterModal";
import LoginModal from "./auth/LoginModal";
import Logout from "./auth/Logout";
import logo from "../images/best rated_logo_rgb_dark_white.png";
import WatchedLink from "./WatchedLink";
import AllLink from "./AllLink";
import VintageLink from "./VintageLink";
import { observer } from "mobx-react";

export const AppNavbar = observer((props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [watchedSelected, setWatchedSelected] = useState(false);

  useEffect(() => {
    console.log(
      "AppNavbar useEffect, homeStore.watchedMode:" + homeStore.watchedMode
    );
  }, [watchedSelected]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const turnOnVintageMode = () => {
    const { changePage, currentPage } = props;
    console.log(
      "turnOnVintageMode Before, homeStore.vintageMode:" + homeStore.vintageMode
    );
    homeStore.vintageMode = !homeStore.vintageMode;
    console.log(
      "turnOnVintageMode After, homeStore.vintageMode:" + homeStore.vintageMode
    );
    changePage(currentPage, true); // trigger the Page Results component to re-render
  };

  const turnOnPost1968Mode = () => {
    const { changePage, currentPage } = props;
    console.log(
      "turnOnPost1968Mode Before, homeStore.vintageMode:" +
        homeStore.vintageMode
    );
    homeStore.vintageMode = !homeStore.vintageMode;
    console.log(
      "turnOnPost1968Mode After, homeStore.vintageMode:" + homeStore.vintageMode
    );
    changePage(currentPage, true); // trigger the Page Results component to re-render
  };

  const toggleWatched = () => {
    const { changePage, currentPage } = props;
    console.log(
      "toggleWatched Before, homeStore.watchedMode:" + homeStore.watchedMode
    );
    homeStore.watchedMode = !homeStore.watchedMode;
    console.log(
      "toggleWatched After, homeStore.watchedMode:" + homeStore.watchedMode
    );
    changePage(currentPage, true); // trigger the Page Results component to re-render
  };

  const { isAuthenticated, user } = props.auth;

  const authLinks = (
    <Fragment>
      <NavItem>
        <span className="navbar-text mr-3">
          <strong>{user ? `User ${user.name}` : ""}</strong>
        </span>
      </NavItem>
      {/* <NavItem>
        <WatchedLink watchedSelected={true} />
      </NavItem>
      <NavItem>
        <AllLink watchedSelected={false} />
      </NavItem> */}
      {/* <NavItem>
        <VintageLink turnOnPost1968Mode={turnOnPost1968Mode} />
      </NavItem> */}
      <UncontrolledDropdown inNavbar nav>
        <DropdownToggle caret nav>
          Filter
        </DropdownToggle>
        <DropdownMenu style={{ backgroundColor: "indigo" }}>
          <DropdownItem>
            <Fragment>
              <NavLink href="/">All</NavLink>
            </Fragment>
          </DropdownItem>
          <DropdownItem>
            <Fragment>
              {homeStore.watchedMode ? (
                <NavLink onClick={props.toggleWatched} to="/watched">
                  Watched
                </NavLink>
              ) : (
                <NavLink onClick={props.toggleVintage} href="/watched">
                  Watched
                </NavLink>
              )}
            </Fragment>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
      <UncontrolledDropdown inNavbar nav>
        <DropdownToggle caret nav>
          Mode
        </DropdownToggle>
        <DropdownMenu style={{ backgroundColor: "indigo" }}>
          <DropdownItem>
            <Fragment>
              <NavLink onClick={turnOnVintageMode} to="/vintage">
                Post 1968 Mode
              </NavLink>
            </Fragment>
          </DropdownItem>
          <DropdownItem>
            <Fragment>
              <NavLink onClick={turnOnVintageMode} to="/vintage">
                Vintage Mode
              </NavLink>
            </Fragment>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
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
      <Navbar color="dark" dark expand="sm" className="mb-4">
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
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {isAuthenticated ? authLinks : guestLinks}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

AppNavbar.propTypes = {
  auth: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, null)(AppNavbar);
