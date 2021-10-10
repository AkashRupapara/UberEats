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
          setFvrtRests(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
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
                  <div className="img-overlay-wrap">
                    <Card.Img
                      variant="top"
                      src={
                        ele.restaurant?.restaurant_imgs?.length > 0
                          ? ele?.restaurant?.restaurant_imgs[0].ri_img
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
                    <Card.Title>{ele?.restaurant?.r_name}</Card.Title>
                    <Card.Text>
                      <b>
                        {ele?.restaurant?.restaurant_dishtypes?.length > 0
                          ? ele?.restaurant?.restaurant_dishtypes.map((dishType) => {
                              return dishType.rdt_type + " ";
                            })
                          : " "}
                        <br />
                      </b>
                      {ele?.restaurant?.r_address_line} {ele?.restaurant?.r_city ? ", " + ele?.restaurant?.r_city : ""}
                      {ele?.restaurant?.r_state ? ", " + ele?.restaurant?.r_state : " "}{" "}
                      {ele?.restaurant?.r_zipcode ? ", " + ele?.restaurant?.r_zipcode : " "}
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
