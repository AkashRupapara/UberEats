import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import '../assets/css/restaurantHome.css'

import axiosInstance from '../axiosConfig';
import SimpleImageSlider from "react-simple-image-slider";
// import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/react-responsive-carousel/lib/styles/carousel.css'
import { Button, Card, Col, Row } from 'react-bootstrap';
import Footer from './Footer';
import RestaurantNavbar from './RestaurantNavbar';
const Carousel = require('react-responsive-carousel').Carousel

// import { Carousel } from 'react-responsive-carousel';

const jwt = require('jsonwebtoken');



const RestaurantDashboard = () => {

    // const [emailId, setEmailId] = React.useState('');
    // const [password, setPassword] = React.useState('');

    // const [name, setName] = React.useState('');
    // // const [dateOfBirth, setDateOfBirth] = React.useState('');
    // // const [city, setCity] = React.useState('');
    // // const [stateName, setStateName] = React.useState('');
    // // const [country, setCountry] = React.useState('');
    // // const [contact, setContact] = React.useState('');
    // // const [nname, setNickName] = React.useState('');

    // const dispatch = useDispatch();

    // const restaurantRegister = async (e) => {
    //     dispatch(registerRestaurantRequest());
    //     e.preventDefault();

    //     try {
    //         const data = {
    //             email: emailId,
    //             password: password,
    //             name: name,
    //         }
    //         const response = await axiosInstance.post('auth/resregister', data)
    //         dispatch(registerRestaurantSuccess(response));
    //         localStorage.setItem('token', response.data.token)
    //     } catch (err) {
    //         toast.error(err.response.data.error)                    
    //         dispatch(registerRestaurantFailure(err.response.data.error));
    //     }
    // }
    const history = useHistory();
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    const [images, setimages] = useState([]);
    const [restDetails, setRestDetails] = useState({});
    console.log(images);

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token || token.length === 0) {
            history.push("/");
        }
        const tokenData = jwt.decode(token);
        if (tokenData.role === "customer" || !tokenData.r_id) {
            history.push("/")
        }

        axiosInstance.get(`restaurant/${tokenData.r_id}`, {
            headers: {
                'Authorization': token
            }
        }).then(res => {
            console.log(res.data)
            setimages(res.data.restaurant_imgs);
            const restData = {};
            restData["name"] = res.data.r_name;
            let address = res.data.r_address_line + ", " + res.data.r_city + ", " + res.data.r_state + " - " + res.data.r_zipcode;
            restData["address"] = address;
            restData["desc"] = res.data.r_desc;
            restData["contactNo"] = res.data.r_contact;

            if (res.data.r_delivery_type === "both") {
                restData["deliveryType"] = "Pickup and Delivery"
            } else {
                restData["deliveryType"] = res.data.r_delivery_type;
            }

            let splitStartTime = res.data.r_start.split(":");

            let startTime;
            if (parseInt(splitStartTime[0]) >= 12) {
                startTime = String(splitStartTime[0] - 12) + ":" + String(splitStartTime[1] + " PM")
            } else {
                startTime = String(splitStartTime[0]) + ":" + String(splitStartTime[1] + " AM")
            }

            let splitEndTime = res.data.r_end.split(":");
            let endTime;
            if (parseInt(splitEndTime[0]) >= 12) {
                endTime = String(splitEndTime[0] - 12) + ":" + String(splitEndTime[1] + " PM")
            } else {
                endTime = String(splitEndTime[0]) + ":" + String(splitEndTime[1] + " AM")
            }

            let timings = startTime + " to " + endTime;
            restData["openTime"] = timings;

            let dishTypes = ""
            res.data.restaurant_dishtypes.forEach((ele) => {
                dishTypes = dishTypes + ele.rdt_type + " ";
            });

            restData["dishType"] = dishTypes;

            setRestDetails({
                ...restDetails,
                ...restData,
            })
        });
        // setRestName(response.data.r_name)
        // console.log(response.data.restaurant_imgs)
        // setimages(response.data.restaurant_imgs);

    }, [])

    return (
        <div>
            <RestaurantNavbar />
            <Carousel showArrows={true}>
                {images.map((ele) => (
                    <div style={{ height: "800px" }}>
                        <img src={ele.ri_img} />
                        <p className="legend" style={{ height: "80px", fontSize: "30px" }}>{restDetails.name}</p>
                    </div>
                ))}
            </Carousel>
            <center>
                <Card className="text-center" style={{ width: "50%", borderRadius: "20px" }}>
                    <Card.Header><h3>Description</h3></Card.Header>
                    <Card.Body>
                        <Card.Title><h2><b>{restDetails.name}</b></h2></Card.Title>
                        <Card.Text >
                            <i>
                                <Row>
                                    <Col>
                                        <h3>:: <u>Description </u>:: </h3>
                                        <h4>{restDetails.desc}</h4>
                                    </Col>
                                    <Col>
                                        <h3>:: <u> Address </u> :: </h3>
                                        <h4>{restDetails.address}</h4>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <h3>:: <u> Timings </u> :: </h3>
                                        <h4>{restDetails.openTime}</h4>
                                    </Col>
                                    <Col>
                                        <h3>:: <u> Dish Types Available </u> :: </h3>
                                        <h4>{restDetails.dishType}</h4>
                                    </Col>
                                </Row>
                            </i>
                        </Card.Text>
                    </Card.Body>
                    {/* <Card.Footer className="text-muted">2 days ago</Card.Footer> */}
                </Card>
            </center>
            <Footer />
        </div>
    );
}

export default RestaurantDashboard;