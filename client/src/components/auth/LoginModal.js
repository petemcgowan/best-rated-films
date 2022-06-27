import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  NavLink,
  Alert,
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/authActions";
import { clearErrors } from "../../actions/errorActions";

export const LoginModal = (props) => {
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const prevError = usePrevious(props.error);

  /*More info here: https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state */
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  useEffect(() => {
    console.log("LoginModal, useEffect called");
    const { error, isAuthenticated } = props;
    console.log(
      "LoginModal, useEffect, error:" +
        JSON.stringify(error) +
        ", prevError:" +
        JSON.stringify(prevError)
    );

    if (error !== prevError) {
      // Check for register error
      if (error.id === "LOGIN_FAIL") {
        setMsg(error.msg.msg);
      } else {
        setMsg(null);
      }
    }

    // If authenticated, close modal
    if (modal) {
      if (isAuthenticated) {
        toggle();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    // Clear errors
    props.clearErrors();
    setModal(!modal);
  };

  const onChangeEmail = (e) => {
    console.log(
      "LoginModal, onChangeEmail, name:" +
        e.target.name +
        ", value:" +
        e.target.value
    );
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    console.log(
      "LoginModal, onChangePassword, name:" +
        e.target.name +
        ", value:" +
        e.target.value
    );
    setPassword(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
    };
    console.log("LoginModal, onSubmit, user.email:" + user.email);

    // Attempt to login
    props.login(user);
    console.log("LoginModal, onSubmit after login, user.email:" + user.email);
  };

  return (
    <div>
      <NavLink onClick={toggle} to="/">
        Login
      </NavLink>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Login</ModalHeader>
        <ModalBody>
          {msg ? <Alert color="danger">{msg}</Alert> : null}
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="mb-3"
                onChange={onChangeEmail}
              />

              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="mb-3"
                onChange={onChangePassword}
              />
              <Button color="dark" style={{ marginTop: "2rem" }} block>
                Login
              </Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

LoginModal.propTypes = {
  isAuthenticated: PropTypes.bool,
  error: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});

export default connect(mapStateToProps, { login, clearErrors })(LoginModal);
