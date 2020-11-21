import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import AuthOptions from "../auth/AuthOptions";
import AuthMenus from "../auth/AuthMenus";

export default function Header() {
  return (
    <Navbar expand="lg" className="color-nav">
      <Navbar.Brand href="/">Jueera Collection</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <AuthMenus/>
        </Nav>
        <Nav className="ml-auto">
          <AuthOptions/>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
