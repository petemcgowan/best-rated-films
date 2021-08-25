import reduxAuthStore from "../reduxAuthStore";

export const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export function getEmail() {
  const localEmail = localStorage.getItem("BRFemail");
  const reduxAuthState = reduxAuthStore.getState();

  var email = "";
  if (
    reduxAuthState.auth !== undefined &&
    reduxAuthState.auth !== null &&
    reduxAuthState.auth.user !== null
  ) {
    console.log(
      "getEmail, state.auth.user.email" +
        JSON.stringify(reduxAuthState.auth.user.email)
    );
    email = reduxAuthState.auth.user.email;
  } else if (
    reduxAuthState.auth.email !== undefined &&
    reduxAuthState.auth.email !== null
  ) {
    console.log(
      "getEmail, using reduxAuthState.auth.email" + reduxAuthState.auth.email
    );
    email = reduxAuthState.auth.email;
  } else if (localEmail !== null && localEmail !== "") {
    email = localEmail;
    console.log("getEmail, using local Storage Email" + localEmail);
  }
  return email;
}
