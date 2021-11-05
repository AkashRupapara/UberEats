import { H3, H4, H5, H6 } from "baseui/typography";
import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import axiosConfig from "../../axiosConfig";
import { Button } from "baseui/button";
import { useHistory } from "react-router";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from "baseui/modal";
import RestaurantNavbar from "./RestaurantNavbar";
import { FormControl } from "baseui/form-control";
import { Select } from "baseui/select";
import { Card, StyledAction, StyledBody, StyledThumbnail } from "baseui/card";
import { Table } from "baseui/table-semantic";

function RestaurantOrders() {
  const [allOrderDetails, setAllOrderDetails] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [orderModalIsOpen, setOrderModalIsOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [customerProfile, setCustomerProfile] = useState({});
  const [filterOrderStatus, setFilterOrderStatus] = useState([
    { label: "All" },
  ]);

  const history = useHistory();

  useEffect(() => {
    getFilteredOrders([{label: 'All'}]);
  }, []);

  const getFilteredOrders = (params) => {
    if (params.length > 0 && params[0]?.label === 'All') {
      getRestOrders();
      return;
    }

    const orderStatus = params[0]?.label;
    const token = localStorage.getItem("token");
    axiosConfig
      .get(`/orders/filterorders`, {
        params: {
          orderStatus,
        },
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setAllOrderDetails(res.data);
      })
      .catch((err) => {
        toast.error("Error Fetching Filtered Records");
      });
  };

  const getOrderDetails = (oid) => {
    const token = localStorage.getItem("token");
    axiosConfig
      .get(`/orders/details/${oid}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setOrderDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          toast.error("No Order Found");
        }
      });
  };

  const getCustDetails = (custId) => {
    const token = localStorage.getItem("token");
    axiosConfig
      .get(`/customers/profile/${custId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setCustomerProfile(res.data);
      })
      .catch((err) => {
        
      });
  };

  const updateOrderStatus = (oid, orderStatus) => {
    const token = localStorage.getItem("token");
    axiosConfig
      .put(
        `/orders/updatestatus/${oid}`,
        {
          status: orderStatus,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        getRestOrders();
        toast.success("Order Status Updated");
      })
      .catch((err) => {
        toast.error("Error Updating Status");
      });
  };

  const getRestOrders = () => {
    const token = localStorage.getItem("token");
    axiosConfig
      .get("/orders/", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setAllOrderDetails(res.data);
      })
      .catch((err) => {
        
      });
  };
  return (
    <div>
      <RestaurantNavbar />
      <center>
        <div style={{ marginTop: "3%", width: "50%" }}>
          <Select
            options={[
              { label: "All", id: "#F0F8FF" },
              { label: "Placed", id: "#F0F8FF" },
              { label: "On the Way", id: "#FAEBD7" },
              { label: "Picked Up", id: "#FAEBD7" },
              { label: "Preparing", id: "#FAEBD7" },
              { label: "Ready", id: "#FAEBD7" },
              { label: "Delivered", id: "#FAEBD7" },
              { label: "Cancelled", id: "#FAEBD7" },
            ]}
            valueKey="label"
            labelKey="label"
            value={filterOrderStatus}
            placeholder="Select Order Status"
            onChange={({ value }) => {
              setFilterOrderStatus(value);
              getFilteredOrders(value);
            }}
          />
        </div>
      </center>
      <Modal onClose={() => setModalIsOpen(false)} isOpen={modalIsOpen}>
        <ModalHeader>{customerProfile.name}</ModalHeader>
        <ModalBody>
          <Card
            overrides={{ Root: { style: { width: "328px" } } }}
            style={{ width: "100%", height: "100%" }}
          >
            <StyledThumbnail
              src={
                customerProfile?.c_profile_img
                  ? customerProfile.c_profile_img
                  : "https://ubereats-media.s3.amazonaws.com/guest-user.jpg"
              }
            />
            <StyledBody style={{ textAlign: "left" }}>
              <b> About: </b>
              {customerProfile?.c_about
                ? customerProfile?.c_about
                : "Not Updated"}
              <br />
              <b> City: </b>

              {customerProfile?.c_city}
              <br />
              <b> State: </b>
              {customerProfile?.c_state}
              <br />
              <b> Country: </b>

              {customerProfile?.c_country}
              <br />
              <b> Date Of Birth: </b>

              {customerProfile
                ? new Date(customerProfile?.c_dob).toUTCString().substr(5, 11)
                : null}
              <br />
              <b> Nick Name: </b>

              {customerProfile?.c_nick_name}
              <br />
              <br />
            </StyledBody>
            <StyledAction>
              <Button
                onClick={() => setModalIsOpen(false)}
                overrides={{ BaseButton: { style: { width: "100%" } } }}
              >
                Close
              </Button>
            </StyledAction>
          </Card>
        </ModalBody>
      </Modal>
      <Modal
        onClose={() => setOrderModalIsOpen(false)}
        isOpen={orderModalIsOpen}
      >
        <div style={{ margin: "5%" }}>
          <ModalHeader>Reciept</ModalHeader>
          <hr />
          <ModalBody>
          <Row>
              <H4>{orderDetails.custName}</H4>
            </Row>
            <Row>
              <Col style={{ textAlign: 'left' }}>
                <H5>Total</H5>
              </Col>
              <Col xs={4}>
                <H6> $ {orderDetails.finalOrderPrice}</H6>
              </Col>
            </Row>
            {orderDetails.dishes && orderDetails.dishes.length > 0
              ? orderDetails.dishes.map((dish) => {
                  return (
                    <Row>
                      <Col style={{ textAlign: 'left' }}>{dish?.name}</Col>
                      <Col xs={4}>${(dish?.totalPrice / dish?.qty).toFixed(2)}</Col>
                    </Row>
                  );
                })
              : null}
            <hr />
            <Row>
              <Col style={{ textAlign: 'left' }}>Order Address:</Col>
              <Col style={{ textAlign: 'right' }}>{orderDetails.orderAddress}</Col>
            </Row>
            <Row>
              <Col style={{ textAlign: 'left' }}>Notes:</Col>
              <Col style={{ textAlign: 'right' }}>{orderDetails.notes}</Col>
            </Row>
         
          </ModalBody>
          <ModalFooter>
            <ModalButton onClick={() => setOrderModalIsOpen(false)}>
              Okay
            </ModalButton>
          </ModalFooter>
        </div>
      </Modal>
      <div>
        <Row style={{ margin: "1% 5% 5% 5%" }}>
          <H3 style={{ textAlign: "left" }}>Past Orders</H3>
          {allOrderDetails
            ? allOrderDetails.length > 0
              ? allOrderDetails.map((order) => (
                  <>
                    <div
                      style={{
                        display: "flex",
                        marginLeft: "-27px",
                        marginTop: "20px",
                      }}
                    >
                      <Col>
                        <img
                          className="col-sm-12"
                          src={
                            order?.custImage
                              ? order?.custImage
                              : "https://ubereats-media.s3.amazonaws.com/guest-user.jpg"
                          }
                          alt="sans"
                          style={{ height: "200px" }}
                          onClick={async () => {
                            await getCustDetails(order?.customer?._id);
                            setModalIsOpen(true);
                          }}
                        />
                      </Col>
                      <Col
                        xs={7}
                        style={{ textAlign: "left", marginLeft: "2%" }}
                      >
                        <H5>
                          <a>{order?.custName}</a> ({order.status})
                        </H5>
                        <p>
                          Total Items: {order.dishes?.length} <br />
                          Total Price: ${order.finalOrderPrice} <br />
                          Order Place:{" "}
                          {new Date(order.createdAt).toUTCString()} <br />
                          Order Type: {order.orderType} <br />
                          <br />
                          <span
                            className="hoverUnderline"
                            style={{ fontWeight: "bold" }}
                            onClick={async () => {
                              await getOrderDetails(order._id);
                              setOrderModalIsOpen(true);
                            }}
                          >
                            View receipt
                          </span>
                        </p>
                      </Col>
                      <Col style={{ marginRight: "45px" }}>
                        <div style={{ justifyContent: "center" }}>
                          <FormControl label="Update Order Status">
                            {order ? (
                              order.orderType === "Delivery" ? (
                                <Select
                                  options={[
                                    { orderStatus: "Preparing" },
                                    { orderStatus: "On the Way" },
                                    { orderStatus: "Delivered" },
                                    { orderStatus: "Cancelled" },
                                    { orderStatus: "Placed" },
                                  ]}
                                  valueKey="orderStatus"
                                  labelKey="orderStatus"
                                  placeholder="Select Order Status"
                                  value={[{orderStatus: order.status}]}
                                  onChange={({ value }) =>
                                    updateOrderStatus(order._id, value[0].orderStatus)
                                  }
                                />
                              ) : (
                                <Select
                                  options={[
                                    { orderStatus: "Preparing" },
                                    { orderStatus: "Ready" },
                                    { orderStatus: "Picked Up" },
                                    { orderStatus: "Cancelled" },
                                    { orderStatus: "Placed" },
                                  ]}
                                  valueKey="orderStatus"
                                  labelKey="orderStatus"
                                  placeholder="Select Order Status"
                                  value={[{orderStatus: order.status}]}
                                  onChange={({ value }) =>
                                    updateOrderStatus(order._id, value[0].orderStatus)
                                  }
                                />
                              )
                            ) : null}
                          </FormControl>
                          
                        </div>
                      </Col>
                    </div>
                    <hr />
                  </>
                ))
              : null
            : null}
        </Row>
      </div>
    </div>
  );
}

export default RestaurantOrders;
