import React from "react";
import { Router } from "@reach/router";
import SignIn from "./Login";
import SignUp from "./Signup";
import ProfilePage from "./ProfilePage";
import PasswordReset from "./PasswordReset";
import {useContext} from 'react';
import { UserContext } from "../providers/UserProvider";

function Application() {
  const user = useContext(UserContext);
  return (
    user ?
    <ProfilePage />
    :
    <Router>
        <SignUp path="signUp" />
        <SignIn path="/" />
        <PasswordReset path = "passwordReset" />
    </Router>
  );
}
export default Application;