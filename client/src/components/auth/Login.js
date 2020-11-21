import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Axios from 'axios';
import UserContext from "../../context/UserContext";
import ErrorNotice from "../misc/ErrorNotice";

export default function Login() {
  const [user, setUser] = useState({username:"",password:""});
  const [error, setError] = useState();

  const onChange = e => {
    e.preventDefault();
    setUser({...user,[e.target.name]: e.target.value});
  }

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const loginRes = await Axios.post(
        "http://localhost:4000/api/user/login",
        user
      );
      setUserData({
        token: loginRes.data.token,
        user: loginRes.data.user,
      });
      localStorage.setItem("auth-token", loginRes.data.token);
      history.push("/");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };
  return (
    <div className="page">
      <h2>Log in</h2>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <form className="form" onSubmit={submit}>
        <label htmlFor="login-username">Username</label>
        <input
          id="login-username"
          name="username"
          type="text"
          onChange={onChange}
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          onChange={onChange}
        />

        <input type="submit" value="Log in" />
      </form>
    </div>
  );
}
