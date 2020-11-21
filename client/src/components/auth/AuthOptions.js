import React, { useContext } from "react";
import { Nav } from "react-bootstrap";
import UserContext from "../../context/UserContext";

export default function AuthOptions() {
  const { userData, setUserData } = useContext(UserContext);

  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
  };

  return (
    <nav className="auth-options">
      {userData.user ? (
        <Nav>
        <Nav.Link>Welcome {userData.user.username}</Nav.Link>
        <Nav.Link onClick={logout}>Log Out</Nav.Link>
      </Nav>
      ) : (
        <Nav>
          <Nav.Link href="/register">Register</Nav.Link>
          <Nav.Link href="/login">Login</Nav.Link>
        </Nav>
      )}
    </nav>
  );
}
