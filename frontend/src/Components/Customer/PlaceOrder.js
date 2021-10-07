import { FormControl } from "baseui/form-control";
import { Select } from "baseui/select";
import React, {useState, useEffect} from "react";
import { Col, Row } from "react-bootstrap";
import axiosConfig from "../../axiosConfig";
import CustomerNavbar from "./CustomerNavbar";
import { useHistory, match } from "react-router";

function PlaceOrder({match}) {

    const [addresses, setAddresses] = useState([]);
    const [orderDetails, setOrderDetails] = useState({});

    const getAddresses = () => {
        const token = localStorage.getItem("token");
        axiosConfig.get("/customers/address",{
            headers:{
                Authorization: token,
            }
        }).then((res)=>{
            setAddresses(res.data);
        }).catch((err)=>{
            console.log(err.response.data);
        });
    } 

    const getOrderDetails = () =>{
        const token = localStorage.getItem("token");
        axiosConfig.get(`/orders/${match.params.oid}`,{
            headers:{
                Authorization: token,
            }
        }).then((res)=>{
            setOrderDetails(res.data);
        }).catch((err)=>{
            console.log(err.response.data);
        });
    }

    useEffect(() => {
        getAddresses();
        getOrderDetails();
    }, [])
    console.log(orderDetails);
    
  return (
    <div>
      <CustomerNavbar />
      <Row>
        <Col>
        <center>
          <form style={{width:"50%"}}>
            <FormControl label="Select Delivery Address">
              <Select
                options={[
                  { address: "San Jose" },
                  { address: "San Francisco" },
                  { address: "New York" },
                  { address: "Santa Clara" },
                ]}
                valueKey="address"
                labelKey="address"
                placeholder="Select address"
              />
            </FormControl>
            <FormControl label="Select Delivery Type">
              <Select
                options={[
                  { deliveryType: "Delivery" },
                  { deliveryType: "Pickup" },
                ]}
                valueKey="deliveryType"
                labelKey="deliveryType"
                placeholder="Select delivery Type"
              />
            </FormControl>
          </form>
          </center>
        </Col>
        <Col>
                <p>Total Price: {orderDetails.o_total_price}</p>
                <p>Tax: {orderDetails.o_tax}</p>
                <p>Final Price: {orderDetails.o_final_price}</p>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrder;
