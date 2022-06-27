import React, { useEffect, Fragment } from "react";
import { NavLink } from "reactstrap";
import { observer } from "mobx-react";
import homeStore from "../store/HomeStore";

// If in watched mode, make the menu item All, if in All mode, make the menu item Watched

export const WatchedLink = observer((props) => {
  useEffect(() => {
    console.log("WatchedLink, homeStore.watchedMode:" + homeStore.watchedMode);
  }, [homeStore.watchedMode]);

  return (
    <Fragment>
      {homeStore.watchedMode ? (
        <NavLink
          onClick={props.toggleWatched}
          style={{ color: "white" }}
          to="/watched"
        >
          Watched
        </NavLink>
      ) : (
        <NavLink onClick={props.toggleVintage} href="/watched">
          Watched
        </NavLink>
      )}
    </Fragment>
  );
});

export default WatchedLink;
