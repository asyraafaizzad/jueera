import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import ErrorNotice from "../misc/ErrorNotice";

export default function Register() {
  const [user, setUser] = useState({username:"",password:"",passwordCheck:""});
  const [error, setError] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const onChange = e => {
    e.preventDefault();
    setUser({...user,[e.target.name]: e.target.value});
  }

  const submit = async (e) => {
    e.preventDefault();
    try {
      await Axios.post("http://localhost:4000/api/user/register", user);
      const loginRes = await Axios.post("http://localhost:4000/api/user/login", {
        username: user.username,
        password: user.password,
      });
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
      <h2>Register</h2>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <form className="form" onSubmit={submit}>
        <label htmlFor="register-username">Username</label>
        <input
          id="register-username"
          name="username"
          type="text"
          onChange={onChange}
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          name="password"
          type="password"
          onChange={onChange}
        />
        <input
          name="passwordCheck"
          type="password"
          placeholder="Verify password"
          onChange={onChange}
        />

        <input type="submit" value="Register" />
      </form>
    </div>
  );
}
