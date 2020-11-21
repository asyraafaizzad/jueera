import React, { useContext, useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import ErrorNotice from "../misc/ErrorNotice";

export default function ProductDetails(props) {
  const { userData } = useContext(UserContext);
  const [error, setError] = useState();
  const [ isManage, setIsManage ] = useState(false);
  const [ isLoad, setIsLoad ] = useState(false);
  const [ products, setProducts ] = useState([]);
  const [ productQty, setProductQty ] = useState({qty:0});
  const { match: { params } } = props;

  useEffect(() => {
    const productList = async () => {
      if(userData.token){
        const productRes = await Axios.get(
          `http://localhost:4000/api/product/${params.code}`, {
            headers: { "x-auth-token": userData.token },
          }
        );
        setProducts(productRes.data);
        setIsLoad(true);
      }
      
    };
    productList();
  }, [params.code, userData.token]);

  const onChangeQty = e => {
    e.preventDefault();
    setProductQty({qty: e.target.value});
  };

  const addStock = () => {
    const endpoint = `addstock/${params.code}`;
    submit(endpoint,'Add');
  };

  const minusStock = () => {
    const endpoint = `minusstock/${params.code}`;
    submit(endpoint,'Minus');
  };

  const resetStock = () => {
    const endpoint = `resetstock/${params.code}`;
    submit(endpoint,'Reset');
  };

  const submit = async (endpoint, operation) => {
    try {
        if(userData.token){
            await Axios.put(`http://localhost:4000/api/product/${endpoint}`, productQty, {
                headers: { 
                    "x-auth-token": userData.token 
                }
            }
            );
            const productRes = await Axios.get(
                `http://localhost:4000/api/product/${params.code}`, {
                    headers: { "x-auth-token": userData.token },
                }
            );
            setProducts(productRes.data);
            setProductQty({qty:0});
            alert(operation + " Success");
        }
        else{
            setError('No Authentication');
        }
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  const manage = () => {
    setIsManage(!isManage);
  };

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
          <h2>{params.code}</h2>
          {error && (
                <ErrorNotice message={error} clearError={() => setError(undefined)} />
            )}
          <Container>
            
              {products.map((product, index) => (
                  <Row key={index}>
                    <Col style={{ marginBottom: '2rem' }}>
                    <Card style={{ height:'100%', padding: '2rem'}}>
                        <Card.Img variant="top" src={product.Image} alt="lolo" />
                    </Card>  
                    </Col>
                    <Col sm={8} style={{ marginBottom: '2rem' }}>
                    <Card style={{ height:'100%', padding: '2rem', textAlign: 'left'}}>
                    <Card.Body>
                        <Card.Title>Code : {product.InternalCode}</Card.Title>
                        <Card.Title>{product.SupplierCode ? ( <>Supplier Code : {product.SupplierCode}</>) : ( <></>)}</Card.Title>
                        <Card.Title>{product.Name ? ( <>{product.Name}</>) : ( <></>)}</Card.Title>
                        <Card.Title>Qty: {product.Quantity}</Card.Title>
                        <Card.Text>
                        {product.Description}
                        </Card.Text>
                        <div>
                            <Button className="pink-button"><Link to={`/products/edit/${product.InternalCode}`}>Edit Product Details</Link></Button>
                        </div>
                        <hr></hr>
                        <div>
                            <Button className="pink-button" onClick={manage}>{isManage ? 'Close' : 'Manage Stock'}</Button>
                        </div>
                        {isManage ? (<>
                            <Form onSubmit={addStock}>
                                <Form.Group>
                                    <Form.Row>
                                        <Col>
                                            <Form.Control value={productQty.qty} name="addQty" type="number" placeholder="Enter qty" onChange={onChangeQty}/>
                                        </Col>
                                        <Button className="pink-button" onClick={addStock}>
                                            Add Stock
                                        </Button>
                                        <Button className="pink-button" onClick={minusStock}>
                                            Minus Stock
                                        </Button>
                                        <Button className="pink-button" onClick={resetStock}>
                                            Reset Stock
                                        </Button>
                                    </Form.Row>
                                </Form.Group>
                            </Form>
                        </>) : (<></>)}
                    </Card.Body>
                    </Card>  
                </Col>
            </Row>
              ))}
          </Container>
        </>
        )}
          
        </>
      )}
    </div>
  );
}
