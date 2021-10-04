import React, { Fragment } from "react";
import { NavLink } from "reactstrap";
import { observer } from "mobx-react";
import homeStore from "../store/HomeStore";

export const VintageLink = observer((props) => {
  return (
    <Fragment>
      <NavLink onClick={props.toggleVintage} to="/vintage">
        {homeStore.vintageMode ? "Post 1968 Mode" : "Vintage Mode"}
      </NavLink>
    </Fragment>
  );
});

export default VintageLink;
