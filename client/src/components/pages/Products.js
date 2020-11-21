import React, { useContext, useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Axios from "axios";
import UserContext from "../../context/UserContext";

export default function Products() {
  const { userData } = useContext(UserContext);
  const [ isLoad, setIsLoad ] = useState(false);
  const [ products, setProducts ] = useState([]);

  useEffect(() => {
    const productList = async () => {
      if(userData.token){
        const productRes = await Axios.get(
          "http://localhost:4000/api/product/", {
            headers: { "x-auth-token": userData.token },
          }
        );
        setProducts(productRes.data);
        setIsLoad(true);
      }
      
    };
    productList();
  }, [userData]);

  return (
    <div className="page">
      {!userData.user ? (
        <Redirect to="/"/>
      ) : (
        <>
        {!isLoad ? (
          <h2>Loading</h2>
        ) : (
          <>
          <h2>Products</h2>
          <Container>
            <Row md={3}>
              {products.map((product, index) => (
                <Col key={index} style={{ marginBottom: '2rem' }}>
                  <Card style={{ height:'100%', padding: '2rem'}}>
                    <Card.Img variant="top" src={product.Image} alt="lolo" />
                    <Card.Body>
                      <Card.Title>Code : {product.InternalCode}</Card.Title>
                      <Card.Title>{product.SupplierCode ? ( <>Supplier Code : {product.SupplierCode}</>) : ( <></>)}</Card.Title>
                      <Card.Title>{product.Name ? ( <>{product.Name}</>) : ( <></>)}</Card.Title>
                      <Card.Title>Qty: {product.Quantity}</Card.Title>
                      <Card.Text>
                        {product.Description}
                      </Card.Text>
                      <Button className="pink-button"><Link to={`/products/${product.InternalCode}`}>Details</Link></Button>
                    </Card.Body>
                  </Card>  
                </Col>
              ))}
            </Row>
          </Container>
        </>
        )}
          
        </>
      )}
    </div>
  );
}
