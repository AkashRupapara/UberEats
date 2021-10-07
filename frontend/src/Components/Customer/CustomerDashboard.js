import { H3 } from "baseui/typography";
import React, { useEffect, useState, useDispatch } from "react";
import { Card, StyledBody, StyledAction } from "baseui/card";
import { useHistory } from "react-router";
import { Button, Col, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import axiosConfig from "../../axiosConfig";
import CustomerNavbar from "./CustomerNavbar";

function CustomerDashboard() {
  const history = useHistory();
  useEffect(() => {
    getAllRestaurants();
  }, []);

  //   const [index, setIndex] = useState(0);
  //   const dispatch = useDispatch();
  //   const handleSelect = (selectedIndex, e) => {
  //     setIndex(selectedIndex);
  //   };

  const [allRestDetails, setAllRestDetails] = useState([]);
  const getAllRestaurants = () => {
    const token = localStorage.getItem("token");
    axiosConfig
      .get("/restaurant/all", {
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

  return (
    <div>
      <CustomerNavbar />
      <Row>
        {allRestDetails?.length > 0 ? (
          allRestDetails.map((ele) => (
            <Col xs={3} style={{ marginTop: "30px" }}>
              <div onClick={()=> {
                history.push(`/customer/restaurant/${ele.r_id}`);
              }}>
                <Card
                  overrides={{ Root: { style: { width: "328px" } } }}
                  headerImage={
                    ele.restaurant_imgs.length > 0
                      ? ele.restaurant_imgs[0].ri_img
                      : "https://ubereats-media.s3.amazonaws.com/defaultRest.png"
                  }
                  title={ele.r_name}
                  style={{ height: "100%" }}
                >
                  <StyledBody>
                    {ele.r_address_line} {ele.r_city ? ", " + ele.r_city : ""}{" "}
                    {ele.r_state ? ", " + ele.r_state : " "}{" "}
                    {ele.r_zipcode ? ", " + ele.r_zipcode : " "}
                    <br></br>
                    <b>
                      {ele.restaurant_dishtypes.length > 0
                        ? ele.restaurant_dishtypes.map((dishType) => {
                            return dishType.rdt_type + " ";
                          })
                        : " "}
                    </b>
                  </StyledBody>
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
