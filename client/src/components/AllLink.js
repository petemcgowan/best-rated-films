import React, { Fragment } from "react";
import { NavLink } from "reactstrap";
import { observer } from "mobx-react";
import homeStore from "../store/HomeStore";

export const AllLink = observer((props) => {
  return (
    <Fragment>
      <NavLink href="/">All</NavLink>
    </Fragment>
  );
});

export default AllLink;
