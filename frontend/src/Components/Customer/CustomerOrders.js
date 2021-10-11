import { H3, H5, H6 } from "baseui/typography";
import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import axiosConfig from "../../axiosConfig";
import CustomerNavbar from "./CustomerNavbar";
import { useHistory } from "react-router";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from "baseui/modal";
import { Select } from "baseui/select";

function CustomerOrders() {
  const [allOrderDetails, setAllOrderDetails] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [orderModalIsOpen, setOrderModalIsOpen] = useState(false);
  const [filterOrderStatus, setFilterOrderStatus] = useState([
    { label: "All" },
  ]);
  const history = useHistory();

  useEffect(() => {
    getCustOrders();
  }, []);

  const getFilteredOrders = (params) => {
    if (params[0].label === "All") {
      getCustOrders();
      return;
    }

    const orderStatus = params[0].label;
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
      .get(`/orders/${oid}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setOrderDetails(res.data);
        
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast.error("NO Order Found");
        }
        
      });
  };

  const getCustOrders = () => {
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
      <CustomerNavbar />
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
      <Modal
        onClose={() => setOrderModalIsOpen(false)}
        isOpen={orderModalIsOpen}
      >
        <div style={{ margin: "5%" }}>
          <ModalHeader>Reciept</ModalHeader>
          <hr />
          <ModalBody>
            <Row>
              <Col style={{ textAlign: "left" }}>
                <H5>Total</H5>
              </Col>
              <Col xs={4}>
                <H6> $ {orderDetails.o_final_price}</H6>
              </Col>
            </Row>
            {orderDetails?.order_dishes?.length > 0
              ? orderDetails.order_dishes.map((dish) => {
                  return (
                    <Row>
                      <Col style={{ textAlign: "left" }}>
                        {dish?.dish.d_name}
                      </Col>
                      <Col xs={4}>${dish?.dish.d_price}</Col>
                    </Row>
                  );
                })
              : null}
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
                          src={order?.restaurant?.restaurant_imgs[0]?.ri_img}
                          alt="sans"
                          style={{ height: "100%" }}
                          onClick={() =>
                            history.push(
                              `/customer/restaurant/${order?.restaurant?.r_id}`
                            )
                          }
                        />
                      </Col>
                      <Col
                        xs={7}
                        style={{ textAlign: "left", marginLeft: "2%" }}
                      >
                        <H5>
                          <a
                            onClick={() =>
                              history.push(
                                `/customer/restaurant/${order?.restaurant?.r_id}`
                              )
                            }
                          >
                            {" "}
                            {order.restaurant.r_name}{" "}
                          </a>{" "}
                          ({order.o_status})
                        </H5>
                        <p>
                          Total Items: {order.order_dishes.length} <br />
                          Total Price: ${order.o_final_price} <br />
                          Order Place:{" "}
                          {new Date(order.o_date_time).toUTCString()} <br />
                          Order Type: {order.o_type} <br />
                          <br />
                          <span
                            className="hoverUnderline"
                            style={{ fontWeight: "bold" }}
                            onClick={async () => {
                              await getOrderDetails(order.o_id);
                              setOrderModalIsOpen(true);
                            }}
                          >
                            View receipt
                          </span>
                        </p>
                      </Col>
                      <Col style={{ marginRight: "45px" }}>
                        <div style={{ justifyContent: "center" }}></div>
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

export default CustomerOrders;
