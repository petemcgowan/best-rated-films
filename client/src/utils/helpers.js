import store from "../store";

export const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export function getEmail() {
  const localEmail = localStorage.getItem("BRFemail");
  console.log("getEmail, localEmail" + JSON.stringify(localEmail));
  const state = store.getState();
  var email = "";
  if (
    state.auth !== undefined &&
    state.auth !== null &&
    state.auth.user !== null
  ) {
    console.log(
      "getEmail, state.user.email" + JSON.stringify(state.auth.user.email)
    );
    email = state.auth.user.email;
  } else if (localEmail !== null && localEmail !== "") {
    console.log("getEmail, setting email to local storage version");
    email = "Jun15@gmail.com";
    // HACK Pete Todo
  }
  console.log("getEmail, state" + JSON.stringify(state));
  return email;
}
