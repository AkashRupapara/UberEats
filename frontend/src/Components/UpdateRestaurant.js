////// Format city variable


import RestaurantNavbar from "./RestaurantNavbar";
import React, {
    useEffect,
    useState,
} from "react";
import {
    Redirect,
    useHistory,
} from "react-router";

import "../assets/css/restaurantHome.css";
import axiosInstance from "../axiosConfig";


import "../../node_modules/react-responsive-carousel/lib/styles/carousel.css";
import {
    Button,
    Card,
    Col,
    Row,
} from "react-bootstrap";
import Footer from "./Footer";

import { Input } from "baseui/input";

import { FormControl } from "baseui/form-control";
import { Select } from "baseui/select";
import { TimePicker } from "baseui/timepicker";
import toast from "react-hot-toast";

const jwt = require("jsonwebtoken");

const Carousel =
    require("react-responsive-carousel").Carousel;

function UpdateRestaurant() {
    const history = useHistory();
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    const [images, setimages] = useState([]);
    const [restDetails, setRestDetails] = useState(
        {}
    );

    const [formDetails, setformDetails] = useState(
        {}
    );

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token.length === 0) {
            history.push("/");
        }
        const tokenData = jwt.decode(token);
        if (
            tokenData.role === "customer" ||
            !tokenData.r_id
        ) {
            history.push("/");
        }

        axiosInstance
            .get(`restaurant/${tokenData.r_id}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                console.log(res.data);
                setimages(res.data.restaurant_imgs);
                const restData = {};
                restData["name"] = res.data.r_name;
                let address =
                    res.data.r_address_line +
                    ", " +
                    res.data.r_city +
                    ", " +
                    res.data.r_state +
                    " - " +
                    res.data.r_zipcode;
                restData["address"] = address;
                restData["desc"] = res.data.r_desc;
                restData["contactNo"] =
                    res.data.r_contact;

                if (res.data.r_delivery_type === "both") {
                    restData["deliveryType"] =
                        "Pickup and Delivery";
                } else {
                    restData["deliveryType"] =
                        res.data.r_delivery_type;
                }

                let splitStartTime =
                    res.data.r_start.split(":");

                let startTime;
                if (parseInt(splitStartTime[0]) >= 12) {
                    startTime =
                        String(splitStartTime[0] - 12) +
                        ":" +
                        String(splitStartTime[1] + " PM");
                } else {
                    startTime =
                        String(splitStartTime[0]) +
                        ":" +
                        String(splitStartTime[1] + " AM");
                }

                let splitEndTime =
                    res.data.r_end.split(":");
                let endTime;
                if (parseInt(splitEndTime[0]) >= 12) {
                    endTime =
                        String(splitEndTime[0] - 12) +
                        ":" +
                        String(splitEndTime[1] + " PM");
                } else {
                    endTime =
                        String(splitEndTime[0]) +
                        ":" +
                        String(splitEndTime[1] + " AM");
                }

                let timings =
                    startTime + " to " + endTime;
                restData["openTime"] = timings;

                let dishTypes = "";
                res.data.restaurant_dishtypes.forEach(
                    (ele) => {
                        dishTypes =
                            dishTypes + ele.rdt_type + " ";
                    }
                );

                restData["dishType"] = dishTypes;

                setRestDetails({
                    ...restDetails,
                    ...restData,
                });
            });
        // setRestName(response.data.r_name)
        // console.log(response.data.restaurant_imgs)
        // setimages(response.data.restaurant_imgs);
    }, []);

    const updateRest = async (e) => {
        e.preventDefault();

        const dishTypes = [];
        const newDishType = formDetails.dish_type.forEach(ele => {
            dishTypes.push(ele.dish_type);
        });

        formDetails.dish_type = dishTypes;
        formDetails.city = formDetails.city[0].city;
        formDetails.delivery_type = formDetails.delivery_type[0].delivery_type;
        formDetails.state = formDetails.state[0].state;

        var startTime = formDetails.start.toLocaleTimeString();
        startTime = startTime.slice(0, -3);
        var endTime = formDetails.end.toLocaleTimeString();
        endTime = endTime.slice(0, -3);

        formDetails.start = startTime;
        formDetails.end = endTime;

        const token = localStorage.getItem("token");
        if (!token || token.length === 0) {
            history.push("/");
        }
        const tokenData = jwt.decode(token);
        if (
            tokenData.role === "customer" ||
            !tokenData.r_id
        ) {
            history.push("/");
        }

        try {

            await axiosInstance.put(`restaurant/${tokenData.r_id}`,
                formDetails, {
                headers: {
                    Authorization: token,
                }
            });
            toast.success("UPDATED")
        } catch (err) {
            toast.error(err.response.data.error)
        }

    };

    return (
        <div>
            <RestaurantNavbar />
            <Row>
                <Col>
                    <Carousel showArrows={true}>
                        {images.map((ele) => (
                            <div style={{ height: "800px" }}>
                                <img src={ele.ri_img} />
                                <p
                                    className="legend"
                                    style={{
                                        height: "80px",
                                        fontSize: "30px",
                                    }}
                                >
                                    {restDetails.name}
                                </p>
                            </div>
                        ))}
                    </Carousel>
                </Col>
                <Col>
                    <h2>
                        <b> Details </b>
                    </h2>
                    <form onSubmit={updateRest}>
                        <FormControl label="Restaurant Name">
                            <Input
                                id="name"
                                autoComplete="off"
                                placeholder="Enter Name"
                                value={formDetails.name}
                                onChange={(e) =>
                                    setformDetails({
                                        ...formDetails,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </FormControl>

                        <FormControl label="Restaurant Description">
                            <Input
                                id="desc"
                                autoComplete="off"
                                placeholder="Enter Description"
                                value={formDetails.desc}
                                onChange={(e) =>
                                    setformDetails({
                                        ...formDetails,
                                        desc: e.target.value,
                                    })
                                }
                            />
                        </FormControl>

                        <FormControl label="Restaurant Dish Type">
                            <Select
                                multi
                                options={[
                                    { dish_type: 'Veg' },
                                    { dish_type: 'Non-Veg' },
                                    { dish_type: 'Vegan' },
                                ]}
                                valueKey="dish_type"
                                labelKey="dish_type"
                                placeholder="Select Dish Types"
                                value={formDetails.dish_type}
                                onChange={({ value }) =>
                                    setformDetails({
                                        ...formDetails,
                                        dish_type: value,
                                    })
                                }
                            />
                        </FormControl>

                        <FormControl label="Address Line">
                            <Input
                                id="address_line"
                                autoComplete="off"
                                placeholder="Enter Address Line"
                                value={formDetails.address_line}
                                onChange={(e) =>
                                    setformDetails({
                                        ...formDetails,
                                        address_line: e.target.value,
                                    })
                                }
                            />
                        </FormControl>


                        <FormControl label="City Name">
                            <Select
                                options={[
                                    { city: 'San Jose' },
                                    { city: 'San Francisco' },
                                    { city: 'San Diego' },
                                ]}
                                valueKey="city"
                                labelKey="city"
                                placeholder="Select City Name"
                                value={formDetails.city}
                                onChange={({ value }) =>
                                    setformDetails({
                                        ...formDetails,
                                        city: value,
                                    })
                                }
                            />
                        </FormControl>

                        <FormControl label="State Name">
                            <Select
                                creatable
                                options={[
                                    { state: 'California' },
                                    { state: 'Nevada' },
                                    { state: 'Texas' },
                                ]}
                                valueKey="state"
                                labelKey="state"
                                placeholder="Select State Name"
                                value={formDetails.state}
                                onChange={({ value }) =>
                                    setformDetails({
                                        ...formDetails,
                                        state: value,
                                    })
                                }
                            />
                        </FormControl>

                        <FormControl label="Zipcode">
                            <Input
                                id="zipcode"
                                autoComplete="off"
                                placeholder="Enter Zipcode"
                                value={formDetails.zipcode}
                                onChange={(e) =>
                                    setformDetails({
                                        ...formDetails,
                                        zipcode: e.target.value,
                                    })
                                }
                                type="number"
                            />
                        </FormControl>

                        <FormControl label="Contact Number">
                            <Input
                                id="contact"
                                autoComplete="off"
                                placeholder="Enter Contact Number"
                                value={formDetails.contact}
                                onChange={(e) =>
                                    setformDetails({
                                        ...formDetails,
                                        contact: e.target.value,
                                    })
                                }
                            />
                        </FormControl>

                        <FormControl label="Delivery Type">
                            <Select
                                creatable
                                options={[
                                    { delivery_type: 'Pickup' },
                                    { delivery_type: 'Delivery' },
                                    { delivery_type: 'Both' },
                                ]}
                                valueKey="delivery_type"
                                labelKey="delivery_type"
                                placeholder="Select Delivery Type"
                                value={formDetails.delivery_type}
                                onChange={({ value }) =>
                                    setformDetails({
                                        ...formDetails,
                                        delivery_type: value,
                                    })
                                }
                            />
                        </FormControl>

                        <FormControl label=" Restaurant Start Time">
                            <TimePicker
                                value={formDetails.start}
                                placeholder="Enter Restaurant Opening Time"

                                onChange={(value) =>
                                    setformDetails({
                                        ...formDetails,
                                        start: value,
                                    })
                                }
                                step={1800}
                                minTime={new Date('2021-09-28T07:00:00.000z')}
                            />
                        </FormControl>

                        <FormControl label=" Restaurant End Time">
                            <TimePicker
                                value={formDetails.end}
                                placeholder="Enter Restaurant Closing Time"
                                onChange={(value) =>
                                    setformDetails({
                                        ...formDetails,
                                        end: value,
                                    })
                                }
                                step={1800}
                                minTime={new Date('2021-09-28T07:00:00.000z')}
                            />
                        </FormControl>


                        <button type="submit"> Submit </button>
                    </form>
                </Col>
            </Row>
        </div>
    );
}

export default UpdateRestaurant;
