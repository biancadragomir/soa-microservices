import React, { useState } from "react";
import { Link } from "@reach/router";
import { auth } from "../firebase";
import firebase from "firebase/app";
import Button from "react-bootstrap/esm/Button";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState("");

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;

    if (name === "userEmail") {
      setEmail(value);
    } else if (name === "userPassword") {
      setPassword(value);
    }
  };

  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log("User is logged in!");
        firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then(function (idToken) {
            console.log("ID token is: ", idToken);
            setAuthToken(idToken);
            // TODO Send token to your backend via HTTPS
            // ...
            // fetch('http://localhost:3001', {headers: {
            // "Authorization": idToken}})
            // .then(data => data.body)
            // .then(body => console.log(body))
          })
          .catch(function (error) {
            console.log("error");
          });
      })
      .catch((error) => {
        setError("Error signing in with password and email!");
        console.error("Error signing in with password and email", error);
      });
    console.log("should be logged in!");
  };

  return (
    <div className="mt-8">
      <h1 className="text-3xl mb-2 text-center font-bold">Sign In</h1>
      <div className="border border-blue-400 mx-auto w-11/12 md:w-2/4 rounded py-8 px-4 md:px-8">
        {error !== null && (
          <div className="py-4 bg-red-600 w-full text-white text-center mb-3">
            {error}
          </div>
        )}
        <form className="w-25 p-3">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroup-sizing-default">
                Email
              </span>
            </div>
            <input
              type="text"
              class="form-control"
              id="userEmail"
              name="userEmail"
              value={email}
              onChange={(event) => onChangeHandler(event)}
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
          </div>

          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroup-sizing-default">
                Password
              </span>
            </div>
            <input
              type="password"
              class="form-control"
              value={password}
              name="userPassword"
              onChange={(event) => onChangeHandler(event)}
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
          </div>

          <Button
            className="bg-green-400 hover:bg-green-500 w-full py-2 text-white"
            onClick={(event) => {
              signInWithEmailAndPasswordHandler(event, email, password);
            }}
          >
            Sign in
          </Button>
        </form>
        <p className="text-center my-3">or</p>
        {/* <Button className="bg-red-500 hover:bg-red-600 w-full py-2 text-white">
          Sign in with Google
        </Button> */}
        <p className="text-center my-3">
          Don't have an account?{" "}
          <Link to="signUp" className="text-blue-500 hover:text-blue-600">
            Sign up here
          </Link>{" "}
          <br />{" "}
          <Link
            to="passwordReset"
            className="text-blue-500 hover:text-blue-600"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};
export default SignIn;
