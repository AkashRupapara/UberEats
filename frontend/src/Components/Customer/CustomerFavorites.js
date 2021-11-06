import React from "react";
import axiosConfig from "../../axiosConfig";
import CustomerNavbar from "./CustomerNavbar";
import { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import {useHistory} from 'react-router';
import HeartSvg from "./HeartSvg";

function CustomerFavorites() {
  const [fvrtRests, setFvrtRests] = useState([]);
  const history = useHistory();

  const getAllFavorites = () => {
    const token = localStorage.getItem("token");
    axiosConfig
      .get("/customers/fvrts", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data);
          setFvrtRests(res.data);
      })
      .catch((err) => {
        
      });
  };

  useEffect(() => {
    getAllFavorites();
  }, []);
  return (
    <div>
      <CustomerNavbar />
      <Row
        xs={1}
        md={4}
        className="g-4"
        style={{ marginLeft: "2%", marginTop: "2%", marginRight:"2%" }}
      >
        {fvrtRests?.length > 0 ? (
          fvrtRests.map((ele) => (
            <Col xs={3} style={{ marginTop: "30px" }}>
              <div
                onClick={() => {
                  history.push(`/customer/restaurant/${ele.r_id}`);
                }}
                style={{ height: "100%" }}
              >
                <Card style={{ height: "325px", borderRadius: "20px" }}>
                  <div className="img-overlay-wrap">
                    <Card.Img
                      variant="top"
                      src={
                        ele.restaurantImages?.length > 0
                          ? ele?.restaurantImages[0]
                          : "https://ubereats-media.s3.amazonaws.com/defaultRest.png"
                      }
                      style={{ height: "200px", width: "100%" }}
                    />
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <HeartSvg />
                    </div>
                  </div>
                  <Card.Body>
                    <Card.Title>{ele?.name}</Card.Title>
                    <Card.Text>
                      <b>
                        {ele?.dish_types?.length > 0
                          ? ele?.dish_types.map((dishType) => {
                              return dishType + " ";
                            })
                          : " "}
                        <br />
                      </b>
                      {ele?.address_line} {ele?.city ? ", " + ele?.city : ""}
                      {ele?.state ? ", " + ele?.state : " "}{" "}
                      {ele?.zipcode ? " " + ele?.zipcode : " "}
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

export default CustomerFavorites;
