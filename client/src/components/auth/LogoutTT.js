import React, { Fragment } from "react";
import { NavLink } from "reactstrap";
import { connect } from "react-redux";
import { logout } from "../../actions/authActions";
import PropTypes from "prop-types";

export const LogoutTT = (props) => {
  return (
    <Fragment>
      <NavLink onClick={props.logout} href="#">
        Logout
      </NavLink>
    </Fragment>
  );
};

LogoutTT.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default connect(null, { logout })(LogoutTT);
