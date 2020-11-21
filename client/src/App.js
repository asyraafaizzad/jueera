import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import {Container} from 'react-bootstrap';
import Axios from "axios";
import Header from "./components/layout/Header";
import Home from "./components/pages/Home";
import Products from "./components/pages/Products";
import AddProduct from "./components/pages/AddProduct";
import EditProduct from "./components/pages/EditProduct";
import ProductDetails from "./components/pages/ProductDetails";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserContext from "./context/UserContext";

import "./bootstrap-4.5.3-dist/css/bootstrap.min.css";
import "./style.css";

export default function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenRes = await Axios.post(
        "http://localhost:4000/api/user/tokenIsValid",
        null,
        { headers: { "x-auth-token": token, "Access-Control-Allow-Origin": "*" } }
      );
      if (tokenRes.data) {
        const userRes = await Axios.get("/api/user/", {
          headers: { "x-auth-token": token },
        });
        setUserData({
          token,
          user: userRes.data,
        });
      }
      setIsLoad(true);
    };
    checkLoggedIn();
  }, []);

  return (
    <>
    { !isLoad ? (
      <>
      <h2>Loading</h2>
      </>
    ) : (
      <BrowserRouter>
        <UserContext.Provider value={{ userData, setUserData }}>
          <Header />
          <Container>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/products" component={Products} />
              <Route exact path="/products/add" component={AddProduct} />
              <Route exact path="/products/:code" component={ProductDetails} />
              <Route path="/products/edit/:code" component={EditProduct} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
            </Switch>
          </Container>
        </UserContext.Provider>
      </BrowserRouter>
    )}
    </>
  );
}
