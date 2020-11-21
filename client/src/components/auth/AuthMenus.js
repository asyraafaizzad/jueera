import React, { useContext } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import UserContext from "../../context/UserContext";

export default function AuthMenus() {
  const { userData } = useContext(UserContext);

  return (
    <nav className="auth-options">
      {userData.user ? (
        <Nav>
          <Nav.Link href="/">Home</Nav.Link>
          <NavDropdown title="Product" id="basic-nav-dropdown">
            <NavDropdown.Item href="/products">Product List</NavDropdown.Item>
            <NavDropdown.Item href="/products/add">Add Product</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      ) : (
        <Nav>
          <Nav.Link href="/">Home</Nav.Link>
        </Nav>
      )}
    </nav>
  );
}
