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
import homeStore from "../store/HomeStore";
import PropTypes from "prop-types";
import RegisterModal from "./auth/RegisterModal";
import LoginModal from "./auth/LoginModal";
import Logout from "./auth/Logout";
import logo from "../images/best rated_logo_rgb_dark_white.png";
import { WatchedLink } from "../components/WatchedLink";
import VintageLink from "./VintageLink";
import { observer } from "mobx-react";

const AppNavbar = observer(
  class extends Component {
    state = {
      isOpen: false,
      // isVintage: true,
    };

    static propTypes = {
      auth: PropTypes.object.isRequired,
    };

    toggle = () => {
      this.setState({
        isOpen: !this.state.isOpen,
      });
    };

    toggleVintage = () => {
      const { changePage, currentPage } = this.props;
      console.log(
        "toggleVintage Before, homeStore.vintageMode:" + homeStore.vintageMode
      );
      // this.setState({
      //   isVintage: !this.state.isVintage,
      // });
      homeStore.vintageMode = !homeStore.vintageMode;
      console.log(
        "toggleVintage After, homeStore.vintageMode:" + homeStore.vintageMode
      );
      changePage(currentPage, true); // trigger the Page Results component to re-render
    };

    render() {
      const { isAuthenticated, user } = this.props.auth;
      // const { changePage, currentPage } = this.props;

      const authLinks = (
        <Fragment>
          <NavItem>
            <span className="navbar-text mr-3">
              <strong>{user ? `Welcome ${user.name}` : ""}</strong>
            </span>
          </NavItem>
          <NavItem>
            <WatchedLink />
          </NavItem>
          <NavItem>
            <VintageLink toggleVintage={this.toggleVintage} />
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
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  {isAuthenticated ? authLinks : guestLinks}
                </Nav>
              </Collapse>
            </Container>
          </Navbar>
        </div>
      );
    }
  }
);

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(AppNavbar);
