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

  const [name, setName] = useState("");

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  const [images, setimages] = useState([]);
  const [restDetails, setRestDetails] = useState({});
  const [isUploading, setIsUploading] = React.useState(false);
  const [dishModalIsOpen, setDishModalIsOpen] = React.useState(false);
  const [selectedDishId, setSelectedDishId] = React.useState(null);
  const [restId, setRestId] = useState("");
  const [timings, setTimings] = useState("");
  const [address, setAddress] = useState("");
  const [dishTypes, setDishTypes] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [desc, setDesc] = useState("");

  const [dishes, setDishes] = useState([]);

  const dish = useSelector((state) => state.dish);

  const getRestData = () => {
    const token = localStorage.getItem("token");

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
      .get(`restaurant/rest/${match.params.restId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setimages(res.data.restaurantImages ? res.data.restaurantImages : []);
        const restData = {};
        setName(res.data.name? res.data.name: "");
        if (
          !(
            res.data.address_line &&
            res.data.city &&
            res.data.state &&
            res.data.zipcode
          )
        ) {
          res.data.address_line = "";
          res.data.city = "";
          res.data.state = "";
          res.data.zipcode = null;
        }
        let address =
          res.data.address_line +
          ", " +
          res.data.city +
          ", " +
          res.data.state +
          " - " +
          res.data.zipcode;
        setAddress(address);
        setDesc(res.data.desc ? res.data.desc : "");
        setContactNo(res.data.contact_no ? res.data.contact_no : "");
        setRestId(res.data._id);

        if (res.data.del_type === "Both" || res.data.del_type === "both" ) {
          setDeliveryType("Pickup and Delivery");
        } else {
          setDeliveryType(res.data.del_type);
        }
        
        const startTime = new Date(res.data?.start?res.data.start:null);
        const endTime = new Date(res.data?.end? res.data.end:null);

        setTimings(startTime.getHours()+":" + startTime.getMinutes() + " to " + endTime.getHours() + ":" + endTime.getMinutes());
        
        let dishTypes = "";
        const temp = res.data?.dish_types?.length>0?res.data.dish_types.forEach((ele)=>{
          dishTypes = dishTypes + ele + " ";
        }):null;

        setDishTypes(dishTypes);

        res.data.dishes = res.data.dishes ? res.data.dishes : [];
        setDishes(res.data.dishes);
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
        dishes={dishes}
        selectedDishId={selectedDishId}
        restId={restId}
        restName={name}
      />
      <CustomerNavbar />
      <Carousel showArrows showThumbs={false}>
        {images?.length > 0
          ? images.map((ele) => (
              <div style={{ height: "500px" }}>
                <img src={ele} />
                <p style={{ height: "80px", fontSize: "30px" }}>
                  {name}
                </p>
              </div>
            ))
          : null}
      </Carousel>
      <br></br>
      <div style={{ textAlign: "left", marginLeft: "2%" }}>
        <H5>
          {name} ({deliveryType}) 
        </H5>
        <H6>{desc}</H6> <H6> Contact: +1 {contactNo}</H6>
        <H6>
          <FontAwesomeIcon icon={faMapMarkerAlt} /> {address}
        </H6>
        <H6>
          <FontAwesomeIcon icon={faClock} /> {timings}
        </H6>
        <H6>
          <FontAwesomeIcon icon={faUtensils} /> {dishTypes}
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
            {dishes?.length > 0 ? (
              dishes.map((ele) => (
                <Col xs={3} key={index} style={{ marginTop: "30px" }}>
                  <Card style={{ height: "100%" }}>
                    <div
                      onClick={() => {
                        setSelectedDishId(ele._id);
                        setDishModalIsOpen(true);
                      }}
                      key={ele._id}
                    >
                      <Card.Img
                        variant="top"
                        src={
                          ele.dishImages?.length > 0
                            ? ele.dishImages[0].image
                            : ""
                        }
                        style={{ height: "200px" }}
                      />
                      <Card.Body  style={{textAlign: "left"}}>
                        <h3 style={{textAlign: "left"}}>{ele.name}</h3>
                        <Card.Text>
                         <h6 style={{color:"gray"}}> {ele.dishType+ " - "}
                          {ele.category}</h6>
                        </Card.Text>
                      </Card.Body>
                      <div  style={{textAlign: "right", marginRight:"2%"}}>
                        <h5>${ele.price} </h5>
                      </div>
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
