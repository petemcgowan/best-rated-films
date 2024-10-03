import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { register } from "../../actions/authActions";
import { clearErrors } from "../../actions/errorActions";

export const RegisterModal2 = (props) => {
  const { isOpen, onClose, isAuthenticated, error, register, clearErrors } = props;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const prevError = usePrevious(props.error);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]); // Track changes in value
    return ref.current;
  }

  useEffect(() => {
    if (error !== prevError) {
      // Check for register error
      if (error.id === "REGISTER_FAIL") {
        setMsg(error.msg.msg);
      } else {
        setMsg(null);
      }
    }

    // Close modal if authenticated
    if (isOpen && isAuthenticated) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isAuthenticated, isOpen, onClose, prevError]);

  const onSubmit = (e) => {
    e.preventDefault();

    // Create user object
    const newUser = {
      name,
      email,
      password,
    };

    // Attempt to register
    register(newUser);
  };

  return (
      <Modal isOpen={isOpen} toggle={onClose}>
        <ModalHeader toggle={onClose}>Register</ModalHeader>
        <ModalBody>
          {msg ? <Alert color="danger">{msg}</Alert> : null}
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                className="mb-3"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />

              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="mb-3"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />

              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="mb-3"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <Button color="dark" style={{ marginTop: "2rem" }} block>
                Register
              </Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});

RegisterModal2.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { register, clearErrors })(
  RegisterModal2
);
