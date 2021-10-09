import { H3 } from "baseui/typography";
import React, { useEffect, useState, useDispatch } from "react";
import { StyledBody, StyledAction } from "baseui/card";
import { useHistory } from "react-router";
import { Button, Col, Card, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import axiosConfig from "../../axiosConfig";
import CustomerNavbar from "./CustomerNavbar";
import { useSelector } from "react-redux";

function CustomerDashboard() {
  const history = useHistory();

  const location = useSelector((state) => state.searchFilter);

  useEffect(() => {
    console.log(location);
    getAllRestaurants();
  }, [location]);

  const [allRestDetails, setAllRestDetails] = useState([]);
  const getAllRestaurants = () => {
    const token = localStorage.getItem("token");
    axiosConfig
      .get("/restaurant/all", {
        params: {
          city: location.location,
        },
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setAllRestDetails(res.data);
      })
      .catch((err) => {
        history.push("/");
        toast.error("Session expired Please Login");
      });
  };

  useEffect(() => {
    getAllRestaurants();
  }, []);

  return (
    <div>
      <CustomerNavbar />
      <Row xs={1} md={4} className="g-4" style={{marginLeft:"2%", marginTop:"2%"}}>
        {allRestDetails?.length > 0 ? (
          allRestDetails.map((ele) => (
            <Col xs={3} style={{ marginTop: "30px" }}>
              <div
                onClick={() => {
                  history.push(`/customer/restaurant/${ele.r_id}`);
                }}
                style={{ height: "100%" }}
              >
                {/* <Card
                  overrides={{ Root: { style: { width: "300px" } } }}
                  title={ele.r_name}
                  style={{ height: "100%", display:"flex", flexDirection:"column", alignContent:"space-between", justifyContent: "space-between" }}
                >
                  <img src={
                    ele.restaurant_imgs.length > 0
                      ? ele.restaurant_imgs[0].ri_img
                      : "https://ubereats-media.s3.amazonaws.com/defaultRest.png"
                  }
                  style={{height:"170px", width:"100%"}}
                  />
                  <StyledBody>
                    {ele.r_address_line} {ele.r_city ? ", " + ele.r_city : ""}{" "}
                    {ele.r_state ? ", " + ele.r_state : " "}{" "}
                    {ele.r_zipcode ? ", " + ele.r_zipcode : " "}
                    <br></br>
                  </StyledBody>
                  <ModalFooter style={{height:"100px", paddingBottom:"1000px" }}>
                    <b>
                      {ele.restaurant_dishtypes.length > 0
                        ? ele.restaurant_dishtypes.map((dishType) => {
                            return dishType.rdt_type + " ";
                          })
                        : " "}
                    </b>
                  </ModalFooter>
                </Card> */}
                <Card style={{ height: "325px", borderRadius: "20px" }}>
                  <Card.Img
                    variant="top"
                    src={
                      ele.restaurant_imgs.length > 0
                        ? ele.restaurant_imgs[0].ri_img
                        : "https://ubereats-media.s3.amazonaws.com/defaultRest.png"
                    }
                    style={{ height: "200px", width: "100%" }}
                  />

                  <Card.Body>
                    <Card.Title>{ele.r_name}</Card.Title>
                    <Card.Text>
                      <b>
                        {ele.restaurant_dishtypes.length > 0
                          ? ele.restaurant_dishtypes.map((dishType) => {
                              return dishType.rdt_type + " ";
                            })
                          : " "}
                        <br />
                      </b>
                      {ele.r_address_line} {ele.r_city ? ", " + ele.r_city : ""}
                      {ele.r_state ? ", " + ele.r_state : " "}{" "}
                      {ele.r_zipcode ? ", " + ele.r_zipcode : " "}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          ))
        ) : (
          <div></div>
        )}
      </Row>
    </div>
  );
}

export default CustomerDashboard;
