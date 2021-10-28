import React, { useEffect, useState, useDispatch } from "react";
import { useHistory } from "react-router";
import { Col, Card, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import axiosConfig from "../../axiosConfig";
import CustomerNavbar from "./CustomerNavbar";
import { useSelector } from "react-redux";
import "../../assets/css/favourites.css";
import HeartSvg from "./HeartSvg";
import _ from 'underscore'

function CustomerDashboard() {
  const history = useHistory();

  const searchFilter = useSelector((state) => state.searchFilter);

  useEffect(() => {
    getAllRestaurantsByKeyword();
  }, [searchFilter.keyWord]);

  const [allRestDetails, setAllRestDetails] = useState([]);

  const getAllRestaurantsByKeyword = () => {
    const token = localStorage.getItem("token");
    axiosConfig
      .get("/restaurant/all/search", {
        params: {
          keyWord: searchFilter.keyWord,
        },
        headers: {
          Authorization: token,
        },
      })
      .then(async (res) => {
        const uniqueData = await _.uniq(
          res.data,
          (x)=>x._id,
        );

        uniqueData.forEach((rest)=>{
          rest.restaurant_imgs = [{ri_img: rest.ri_img}]
        });
        
        setAllRestDetails(uniqueData);
      })
      .catch((err) => {
        // history.push("/");
        toast.error("Session expired Please Login");
      });
  };

  const getAllRestaurants = () => {
    const token = localStorage.getItem("token");

    axiosConfig
      .get("/restaurant/all", {
        params: {
          city: searchFilter.location,
          deliveryType: searchFilter.deliveryType,
          dishType: searchFilter.dishType,
        },
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setAllRestDetails(res.data.filteredRestaurants);
      })
      .catch((err) => {
        // history.push("/");
        console.log(err);
        toast.error("Session expired Please Login");
      });
  };

  const addToFavourite = (rid) => {
    const token = localStorage.getItem("token");
    axiosConfig
      .post(
        "/customers/fvrts",
        {
          rid,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error();
        
      });
  };

  useEffect(() => {
    getAllRestaurants();
  }, [searchFilter.location, searchFilter.deliveryType, searchFilter.dishType]);

  return (
    <div>
      <CustomerNavbar />
      <Row
        xs={1}
        md={4}
        className="g-4"
        style={{ marginLeft: "2%", marginTop: "2%" }}
      >
        {allRestDetails?.length > 0 ? (
          allRestDetails.map((ele) => (
            <Col xs={3} style={{ marginTop: "30px" }}>
              <div
                onClick={() => {
                  history.push(`/customer/restaurant/${ele._id}`);
                }}
                style={{ height: "100%" }}
              >
                <Card style={{ height: "325px", borderRadius: "20px" }}>
                  <div className="img-overlay-wrap">
                    <Card.Img
                      variant="top"
                      src={
                        ele
                          ? ele.restaurantImages?.length > 0
                            ? ele.restaurantImages[0]
                            : "https://ubereats-media.s3.amazonaws.com/defaultRest.png"
                          : "https://ubereats-media.s3.amazonaws.com/defaultRest.png"
                      }
                      style={{ height: "200px", width: "100%" }}
                    />
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        addToFavourite(ele?._id);
                      }}
                    >
                      <HeartSvg />
                    </div>
                  </div>
                  <Card.Body>
                    <Card.Title>{ele.name}</Card.Title>
                    <Card.Text>
                      <b>
                        {ele
                          ? ele.dish_types?.length > 0
                            ? ele.dish_types.map((dishType) => {
                                return dishType + " ";
                              })
                            : " "
                          : " "}
                        <br />
                      </b>
                      {ele.address_line} {ele.city ? ", " + ele.city : ""}
                      {ele.state ? ", " + ele.state : " "}{" "}
                      {ele.zipcode ? ", " + ele.zipcode : " "}
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
