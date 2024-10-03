import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/authActions";
import { clearErrors } from "../../actions/errorActions";

export const LoginModal2 = (props) => {
  const { isOpen, onClose, isAuthenticated, error, login, clearErrors } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const prevError = usePrevious(error);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  // Handling error updates and modal close on successful login
  useEffect(() => {
    if (error !== prevError) {
      // Check for login error
      if (error.id === "LOGIN_FAIL") {
        setMsg(error.msg.msg);
      } else {
        setMsg(null);
      }
    }

    // Close modal if authenticated
    if (isOpen && isAuthenticated) {
      onClose();
    }
  }, [error, isAuthenticated, isOpen, onClose, prevError]);

  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    const user = { email, password };
    login(user);
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose}>
      <ModalHeader toggle={onClose}>Login</ModalHeader>
      <ModalBody>
        {msg ? <Alert color="danger">{msg}</Alert> : null}
        <Form onSubmit={onSubmit}>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={onChangeEmail}
              className="mb-3"
            />

            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={onChangePassword}
              className="mb-3"
            />

            <Button color="dark" style={{ marginTop: "2rem" }} block>
              Login
            </Button>
          </FormGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
};

LoginModal2.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});

export default connect(mapStateToProps, { login, clearErrors })(LoginModal2);