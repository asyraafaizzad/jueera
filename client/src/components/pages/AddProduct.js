import React, { useState, useContext } from "react";
import { Form, Button, Col } from "react-bootstrap";
import Axios from "axios";
import UserContext from "../../context/UserContext";
import ErrorNotice from "../misc/ErrorNotice";

export default function AddProduct() {
  const [product, setProduct] = useState({internal_code:"",supplier_code:"",product_name:"",description:"",image:"",qty:0});
  const [error, setError] = useState();
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');

  const { userData } = useContext(UserContext);

  const onChange = e => {
    e.preventDefault();
    setProduct({...product,[e.target.name]: e.target.value});
  }

  const onChangeFile = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('internal_code', product.internal_code);
    try {
        if(userData.token){
            await Axios.post("http://localhost:4000/api/product/", product, {
                headers: { 
                    "x-auth-token": userData.token 
                }
            }
            );
            await Axios.post('http://localhost:4000/api/product/fileupload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  "x-auth-token": userData.token
                }
            });
            setProduct({internal_code:"",supplier_code:"",product_name:"",description:"",image:"",qty:0});
            setFile('');
            setFilename('Choose File');
            alert("Add Success");
        }
        else{
            setError('No Authentication');
        }
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  return (
    <div className="page">
      <h2>Add Product</h2>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
        <Form onSubmit={submit}>
            <Form.Group>
                <Form.Row>
                    <Form.Label column="lg" lg={2}>Code</Form.Label>
                    <Col>
                        <Form.Control value={product.internal_code} name="internal_code" type="text" placeholder="Enter code" onChange={onChange}/>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Form.Label column="lg" lg={2}>Supplier Code</Form.Label>
                    <Col>
                        <Form.Control value={product.supplier_code} name="supplier_code" type="text" placeholder="Enter supplier code" onChange={onChange}/>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Form.Label column="lg" lg={2}>Product Name</Form.Label>
                    <Col>
                        <Form.Control value={product.product_name} name="product_name" type="text" placeholder="Enter product name" onChange={onChange}/>
                    </Col>
                </Form.Row>
                <Form.Row >
                    <Form.Label column="lg" lg={2}>Description</Form.Label>
                    <Col>
                        <Form.Control value={product.description} as="textarea" name="description" type="text" placeholder="Enter description" onChange={onChange}/>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Form.Label column="lg" lg={2}>Qty</Form.Label>
                    <Col>
                        <Form.Control value={product.qty} name="qty" type="text" placeholder="Enter qty" onChange={onChange}/>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Form.Label column="lg" lg={2}>Image</Form.Label>
                    <Col>
                        <Form.File 
                            id="custom-file"
                            label={filename}
                            onChange={onChangeFile}
                            custom
                        />
                    </Col>
                </Form.Row>
            </Form.Group>
            <Button className="pink-button" type="submit">
                Submit
            </Button>
        </Form>
      
    </div>
  );
}
