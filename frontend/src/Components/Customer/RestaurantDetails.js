import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router";
import "../../assets/css/restaurantHome.css";

import axiosInstance from "../../axiosConfig";
// import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "../../../node_modules/react-responsive-carousel/lib/styles/carousel.css";
import { Button, Col, Card, Container, Row, CardGroup } from "react-bootstrap";
import Footer from "../Footer";
import { Display2, Display4, H1, H2, H3, H4, H5, H6 } from "baseui/typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import UpdateDishModal from "../Dishes/UpdateDishModal";
import { useSelector } from "react-redux";
import AddDishModal from "../Dishes/AddDishModal";
import { useDispatch } from "react-redux";
import CustomerNavbar from "./CustomerNavbar";
import ShowDishModal from "../Dishes/ShowDishModal";

const Carousel = require("react-responsive-carousel").Carousel;
const jwt = require("jsonwebtoken");

const RestaurantDetails = ({ match }) => {
  const history = useHistory();
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  const [images, setimages] = useState([]);
  const [restDetails, setRestDetails] = useState({});
  const [isUploading, setIsUploading] = React.useState(false);
  const [dishModalIsOpen, setDishModalIsOpen] = React.useState(false);
  const [selectedDishId, setSelectedDishId] = React.useState(null);
  const [restId, setRestId] = useState("");
  const dish = useSelector((state) => state.dish);

  const getRestData = () => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (token === null || token === undefined) {
      //   dispatch(restaurantLogout());
      history.push("/");
      return;
    }

    if (!token || token.length === 0) {
      history.push("/");
    }

    const tokenData = jwt.decode(token);
    axiosInstance
      .get(`restaurant/${match.params.restId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setimages(res.data.restaurant_imgs ? res.data.restaurant_imgs : []);
        const restData = {};
        restData["name"] = res.data.r_name ? res.data.r_name : "";

        if (
          !(
            res.data.r_address_line &&
            res.data.r_city &&
            res.data.r_state &&
            res.data.r_zipcode
          )
        ) {
          res.data.r_address_line = "";
          res.data.r_city = "";
          res.data.r_state = "";
          res.data.r_zipcode = null;
        }
        let address =
          res.data.r_address_line +
          ", " +
          res.data.r_city +
          ", " +
          res.data.r_state +
          " - " +
          res.data.r_zipcode;
        restData["address"] = address;
        restData["desc"] = res.data.r_desc ? res.data.r_desc : "";
        restData["contactNo"] = res.data.r_contact ? res.data.r_contact : "";
        restData["restId"] = res.data.r_id;

        res.data.r_delivery_type = res.data.r_delivery_type
          ? res.data.r_delivery_type
          : "";
        if (res.data.r_delivery_type === "both") {
          restData["deliveryType"] = "Pickup and Delivery";
        } else {
          restData["deliveryType"] = res.data.r_delivery_type;
        }

        res.data.r_start = res.data.r_start ? res.data.r_start : "";
        let splitStartTime = res.data.r_start.split(":");

        let startTime;
        if (parseInt(splitStartTime[0]) >= 12) {
          startTime =
            String(splitStartTime[0] - 12) +
            ":" +
            String(splitStartTime[1] + " PM");
        } else {
          startTime =
            String(splitStartTime[0]) + ":" + String(splitStartTime[1] + " AM");
        }
        res.data.r_end = res.data.r_end ? res.data.r_end : "";

        let splitEndTime = res.data.r_end.split(":");
        let endTime;
        if (parseInt(splitEndTime[0]) >= 12) {
          endTime =
            String(splitEndTime[0] - 12) +
            ":" +
            String(splitEndTime[1] + " PM");
        } else {
          endTime =
            String(splitEndTime[0]) + ":" + String(splitEndTime[1] + " AM");
        }

        let timings = startTime + " to " + endTime;
        restData["openTime"] = timings;

        let dishTypes = "";
        res.data.restaurant_dishtypes.forEach((ele) => {
          dishTypes = dishTypes + ele.rdt_type + " ";
        });

        restData["dishType"] = dishTypes;

        res.data.dishes = res.data.dishes ? res.data.dishes : [];
        restData["dishes"] = res.data.dishes;
        let dishObj = {};

        res.data.dishes.forEach((ele) => {
          dishObj[ele.d_id] = false;
        });

        // setDishModalIsOpen(dishObj);
        setRestDetails({
          ...restDetails,
          ...restData,
        });
      })
      .catch((err) => {
        if (err.hasOwnProperty("response")) {
          if (err.response.status === 403 || err.response.status === 401) {
            toast.error("Session Expired Please Login");
            history.push("/restaurantLogin");
          }
        }
      });
  };

  useEffect(() => {
    getRestData();
  }, [dish]);

  return (
    <div>
      <ShowDishModal
        dishModalIsOpen={dishModalIsOpen}
        setDishModalIsOpen={setDishModalIsOpen}
        dishes={restDetails.dishes}
        selectedDishId={selectedDishId}
        restId={restDetails.restId}
        restName={restDetails.name}
      />
      <CustomerNavbar />
      <Carousel showArrows showThumbs={false}>
        {images?.length > 0
          ? images.map((ele) => (
              <div style={{ height: "500px" }}>
                <img src={ele.ri_img} />
                <p style={{ height: "80px", fontSize: "30px" }}>
                  {restDetails.name}
                </p>
              </div>
            ))
          : null}
      </Carousel>
      <br></br>
      <div style={{ textAlign: "left", marginLeft: "2%" }}>
        <H5>
          {restDetails.name} ({restDetails.deliveryType})
        </H5>
        <H6>{restDetails.desc}</H6>
        <H6>
          <FontAwesomeIcon icon={faMapMarkerAlt} /> {restDetails.address}
        </H6>
        <H6>
          <FontAwesomeIcon icon={faClock} /> {restDetails.openTime}
        </H6>
        <H6>
          <FontAwesomeIcon icon={faUtensils} /> {restDetails.dishType}
        </H6>
      </div>
      <div>
        <H3>
          <i>
            <b> TASTY DISHES </b>{" "}
          </i>{" "}
        </H3>
        <br></br>
        <Container fluid>
          <Row>
            {restDetails.dishes?.length > 0 ? (
              restDetails.dishes.map((ele) => (
                <Col xs={3} key={index} style={{ marginTop: "30px" }}>
                  <Card style={{ height: "100%" }}>
                    <div
                      onClick={() => {
                        setSelectedDishId(ele.d_id);
                        setDishModalIsOpen(true);
                      }}
                      key={ele.d_id}
                    >
                      <Card.Img
                        variant="top"
                        src={
                          ele.dish_imgs.length > 0
                            ? ele.dish_imgs[0].di_img
                            : ""
                        }
                        style={{ height: "200px" }}
                      />
                      <Card.Body  style={{textAlign: "left"}}>
                        <h3 style={{textAlign: "left"}}>{ele.d_name}</h3>
                        <Card.Text>
                         <h6 style={{color:"gray"}}> {ele.d_type+ " - "}
                          {ele.d_category}</h6>
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer  style={{textAlign: "right"}}>
                        <h4>$ {ele.d_price} </h4>
                      </Card.Footer>
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <div></div>
            )}
          </Row>
        </Container>
      </div>

      <Footer />
    </div>
  );
};

export default RestaurantDetails;
