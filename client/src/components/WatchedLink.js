import React, { Component, Fragment } from "react";
import { NavLink } from "reactstrap";

export class WatchedLink extends Component {
  render() {
    return (
      <Fragment>
        <NavLink href="/watched">Watched</NavLink>
      </Fragment>
    );
  }
}

export default WatchedLink;
