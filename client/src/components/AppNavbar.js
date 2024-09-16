import React, { Fragment, useState } from "react";
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
import { observer } from "mobx-react";

export const AppNavbar = observer((props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const turnOnVintageMode = () => {
    const { changePage, currentPage } = props;
    homeStore.vintageMode = !homeStore.vintageMode;
    changePage(currentPage, true); // trigger the Page Results component to re-render
  };

  const turnOnPost1968Mode = () => {
    const { changePage, currentPage } = props;
    homeStore.vintageMode = !homeStore.vintageMode;
    changePage(currentPage, true); // trigger the Page Results component to re-render
  };

  const { isAuthenticated, user } = props.auth;

  const authMenuLinks = (
    <Fragment>
      <NavItem>
        <span className="navbar-text mr-3">
          <strong>{user ? `User ${user.name}` : ""}</strong>
        </span>
      </NavItem>
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
              <NavLink onClick={turnOnPost1968Mode} to="/vintage">
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
              {isAuthenticated ? authMenuLinks : guestLinks}
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
