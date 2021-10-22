import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router";
import "../../assets/css/restaurantHome.css";

import axiosInstance from "../../axiosConfig";
// import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "../../../node_modules/react-responsive-carousel/lib/styles/carousel.css";
import { Col, Card, Container, Row, CardGroup } from "react-bootstrap";
import Footer from "../Footer";
import RestaurantNavbar from "./RestaurantNavbar";
import { H1, H2, H3, H4, H5, H6 } from "baseui/typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { uploadFile } from "react-s3";
import toast from "react-hot-toast";
import UpdateDishModal from "../Dishes/UpdateDishModal";
import { useSelector } from "react-redux";
import AddDishModal from "../Dishes/AddDishModal";
import { useDispatch } from "react-redux";
import { dishCreateSuccess, dishDeleteSuccess } from "../../actions/dish";
import { restaurantLogout } from "../../actions/restaurant";
import { Button } from "baseui/button";

const Carousel = require("react-responsive-carousel").Carousel;

// import { Carousel } from 'react-responsive-carousel';

const jwt = require("jsonwebtoken");

const RestaurantDashboard = () => {
  // const [emailId, setEmailId] = React.useState('');
  // const [password, setPassword] = React.useState('');

  const history = useHistory();
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  const [images, setimages] = useState([]);
  const [restDetails, setRestDetails] = useState({});
  const [name, setName] = useState("");
  const [delType, setDelType] = useState("");
  const [timings, setTimings] = useState("");
  const [address, setAddress] = useState("");
  const [dishTypes, setdishTypes] = useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [dishModalIsOpen, setDishModalIsOpen] = React.useState(false);
  const [selectedDishId, setSelectedDishId] = React.useState(null);
  const [addDishModalIsOpen, setAddDishModalIsOpen] = useState(false);
  const dish = useSelector((state) => state.dish);

  const getRestData = () => {
    const token = localStorage.getItem("token");
    

    if (token === null || token === undefined) {
      dispatch(restaurantLogout());
      history.push("/");
      return;
    }

    if (!token || token.length === 0) {
      history.push("/");
    }

    const tokenData = jwt.decode(token);
    if (tokenData.role === "customer" || !tokenData.r_id) {
      history.push("/");
    }

    axiosInstance
      .get(`restaurant/rest/${tokenData.r_id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setName(res.data.name);
        console.log("fetched Data", res.data);
        setimages(res.data.restaurantImages ? res.data.restaurantImages : []);
        const restData = {};
        restData["name"] = res.data.name ? res.data.name : "";
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
        restData["address"] = address;
        setAddress(address);
        restData["desc"] = res.data.desc ? res.data.desc : "";
        restData["contactNo"] = res.data.contact_no ? res.data.contact_no : "";

        res.data.del_type = res.data.del_type
          ? res.data.del_type
          : "";
        if (res.data.del_type === "Both" || res.data.del_type === "both") {
          setDelType("Pickup and Delivery");
        } else {
          setDelType(res.data.del_type);
        }
        
        const startTime = new Date(res.data?.start?res.data.start:null);
        const endTime = new Date(res.data?.end? res.data.end:null);

        setTimings(startTime.getHours()+":" + startTime.getMinutes() + " to " + endTime.getHours() + ":" + endTime.getMinutes());
        

        let dishTypes = "";
        const temp = res.data?.dish_types?.length>0?res.data.dish_types.forEach((ele)=>{
          dishTypes = dishTypes + ele + " ";
        }):null;
        // res.data.restaurant_dishtypes.forEach((ele) => {
        //   dishTypes = dishTypes + ele.rdt_type + " ";
        // });

        // restData["dishType"] = dishTypes;
        setdishTypes(dishTypes);
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
  }, [dish,dishModalIsOpen]);

  // S3 Bucket configurations
  const S3_BUCKET = "ubereats-media";
  const ACCESS_KEY = "AKIA4ZUO22XWRWDIOUMI";
  const SECRET_ACCESS_KEY = "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";
  const REGION = "us-east-1";

  const config = {
    bucketName: S3_BUCKET,
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: REGION,
  };

  const deleteDish = (dishId) => {
    const token = localStorage.getItem("token");
    axiosInstance
      .delete(`/dishes/${dishId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        dispatch(dishDeleteSuccess(true));
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };

  return (
    <div>
      <UpdateDishModal
        dishModalIsOpen={dishModalIsOpen}
        setDishModalIsOpen={setDishModalIsOpen}
        dishes={restDetails.dishes}
        selectedDishId={selectedDishId}
        getRestData={getRestData}
      />
      <AddDishModal
        addDishModalIsOpen={addDishModalIsOpen}
        setAddDishModalIsOpen={setAddDishModalIsOpen}
      />
      <RestaurantNavbar />
      <Carousel showArrows showThumbs={false} >
        {images?.length > 0
          ? images.map((ele) => (
              <div style={{ height: "500px" }}>
                <img src={ele} />
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
          {name} ({delType})
        </H5>
        <H6>{restDetails.desc}</H6>
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
        <H3>TASTY DISHES</H3>
        <br></br>
        <Button
          variant="primary"
          onClick={() => {
            setAddDishModalIsOpen(true);
          }}
        >
          Add New Dish
        </Button>
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
                        style={{ height: "180px" }}
                      />
                        {ele.d_name}
                        {" "}

                          {ele.d_type} {" : "}
                          
                          {ele.d_category}
                        
                    </div>
                    <H6>$ {ele.d_price} </H6>
                      <Row style={{paddingTop:"-2500px"}}>
                        <Col>
                          <Button
                            variant="success"
                            onClick={() => {
                              setSelectedDishId(ele.d_id);
                              setDishModalIsOpen(true);
                            }}
                          >
                            Edit Dish
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            variant="danger"
                            onClick={() => {
                              deleteDish(ele.d_id);
                              setAddDishModalIsOpen(false);
                            }}
                          >
                            Delete Dish
                          </Button>
                        </Col>
                      </Row>
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

export default RestaurantDashboard;
