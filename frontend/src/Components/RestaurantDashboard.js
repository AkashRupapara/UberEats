import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import '../assets/css/restaurantHome.css'

import axiosInstance from '../axiosConfig';
import SimpleImageSlider from "react-simple-image-slider";
// import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/react-responsive-carousel/lib/styles/carousel.css'
import { Button, Col, Card, Container, Row, CardGroup } from 'react-bootstrap';
import Footer from './Footer';
import RestaurantNavbar from './RestaurantNavbar';
import { H1, H2, H3, H4, H5, H6 } from 'baseui/typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { faUtensils } from '@fortawesome/free-solid-svg-icons'
import { StyledBody, StyledAction } from 'baseui/card';



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
            restData["dishes"] = res.data.dishes;

            setRestDetails({
                ...restDetails,
                ...restData,
            })
        });
        // setRestName(response.data.r_name)
        // console.log(response.data.restaurant_imgs)
        // setimages(response.data.restaurant_imgs);

    }, [])

    console.log("lalalalala")

    console.log(restDetails.dishes)
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
            <div style={{ textAlign: "left", marginLeft: "2%" }}>
                <H2> {restDetails.name} ({restDetails.deliveryType})</H2>
                <H4>{restDetails.desc}</H4>
                <H4>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />  {restDetails.address}</H4>

                <H4><FontAwesomeIcon icon={faClock} /> {restDetails.openTime}</H4>

                <H4> <FontAwesomeIcon icon={faUtensils} />  {restDetails.dishType}</H4>
            </div>
            <div>
                <H3> DISHES </H3>
                <Container fluid>
                    <Row>
                        {restDetails.dishes?.length > 0 ? (
                            restDetails.dishes.map((ele) => (
                                <Col xs={3} key={index} style={{ marginTop: '30px' }}>
                                    <Card>
                                        <Card.Img variant="top" src={ele.dish_imgs[0].di_img} style={{height: "300px"}} />
                                        <Card.Body>
                                            <Card.Title>{ele.d_name}</Card.Title>
                                            <Card.Text>
                                                Ingredients: {ele.d_ingredients} <br></br>
                                                Description: {ele.d_desc} <br></br>
                                                Dish Type: {ele.d_type}<br></br>
                                                Category: {ele.d_category}
                                            </Card.Text>
                                        </Card.Body>
                                        <Card.Footer>
                                            <H3>$ {ele.d_price} </H3>
                                            <button> Hello </button>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                        ))): <div></div>}
                    </Row>
                </Container>
                

            </div>

            <Footer />
        </div>
    );
}

export default RestaurantDashboard