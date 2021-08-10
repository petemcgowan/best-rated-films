import React, { Component, Fragment } from "react";
import { NavLink } from "reactstrap";
import { observer } from "mobx-react";
import homeStore from "../store/HomeStore";

const VintageLink = observer(
  class extends Component {
    constructor(props) {
      super(props);
      // this.toggleVintage = props.toggleVintage.bind(this);
    }

    render() {
      console.log(
        "VintageLink, homeStore.vintageMode:" + homeStore.vintageMode
      );
      return (
        <Fragment>
          <NavLink onClick={this.props.toggleVintage} to="/vintage">
            {homeStore.vintageMode ? "Post 1968 Mode" : "Vintage Mode"}
          </NavLink>
        </Fragment>
      );
    }
  }
);

export default VintageLink;
