import RestaurantNavbar from "./RestaurantNavbar";
import React, {
    useEffect,
    useState,
} from "react";
import {
    useHistory,
} from "react-router";
import '../../assets/css/restaurantHome.css';

import { uploadFile } from 'react-s3'
import axiosInstance from "../../axiosConfig";
import { H1, H2, H3, H4, H5, H6 } from 'baseui/typography';
import { FileUploader } from 'baseui/file-uploader';

import {
    Button,
    Col,
    Row,
} from "react-bootstrap";

import { Input } from "baseui/input";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalButton,
} from 'baseui/modal';
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

    const [isUpdating, setUpdating] = useState(false);


    const getRestData = () => {
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
                const newDataObject = {};
                newDataObject["name"] = res.data.r_name;
                newDataObject["desc"] = res.data.r_desc;

                const tempArr = [];

                res.data.restaurant_dishtypes?.forEach((ele) => {
                    tempArr.push({ dish_type: ele.rdt_type })
                });

                console.log(tempArr)

                newDataObject["dish_type"] = tempArr;
                newDataObject["address_line"] = res.data.r_address_line;
                newDataObject["city"] = [{ city: res.data.r_city }];
                newDataObject["state"] = [{ state: res.data.r_state }];
                newDataObject["zipcode"] = res.data.r_zipcode;
                newDataObject["contact"] = res.data.r_contact_no;
                newDataObject["delivery_type"] = [{ delivery_type: res.data.r_delivery_type }]

                const sTime = res.data.r_start.split(":");
                const s = new Date(2021, 10, 30, sTime[0], sTime[1], sTime[2], 0);
                newDataObject["start"] = s;
                const eTime = res.data.r_end.split(":");
                const e = new Date(2021, 10, 30, eTime[0], eTime[1], eTime[2], 0);
                newDataObject["end"] = e;
                setformDetails(newDataObject)
            });
    }

    useEffect(() => {
        getRestData();
    }, []);

    const updateRest = async (e) => {
        e.preventDefault();
        setUpdating(true);
        const dishTypes = [];
        formDetails.dish_type.forEach(ele => {
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
            setUpdating(false);
            toast.success("UPDATED")
            getRestData()
        } catch (err) {
            toast.error(err.response.data.error)
        }

    };

    const [isUploading, setIsUploading] = React.useState(false);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    // S3 Bucket configurations
    const S3_BUCKET = 'ubereats-media';
    const ACCESS_KEY = 'AKIA4ZUO22XWRWDIOUMI';
    const SECRET_ACCESS_KEY = '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';
    const REGION = 'us-east-1';

    const config = {
        bucketName: S3_BUCKET,
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY,
        region: REGION
    }

    const uploadRestImage = (acceptedFiles) => {
        uploadFile(acceptedFiles[0], config)
            .then(
                async (data) => {
                    try {

                        const token = localStorage.getItem('token')
                        await axiosInstance.post('restaurant/restImages', {
                            link: data.location,
                        }, {
                            headers: {
                                Authorization: token,
                            }
                        })
                        toast.success("Hurray!!")
                        setModalIsOpen(false);
                        getRestData();
                    } catch (err) {
                        toast.error(err.response.data.error);
                    }
                }
            )
    }

    return (
        <div>
            <RestaurantNavbar />
            <Row>
                <Col>
                    <Carousel showArrows={true} showThumbs={false}>
                        {images.map((ele) => (
                            <div style={{ height: "500px" }}>
                                <img src={ele.ri_img} />
                            </div>
                        ))}
                    </Carousel>
                    <Button onClick={() => setModalIsOpen(true)}>Upload Image</Button>
                    <Modal isOpen={modalIsOpen}>
                        <ModalHeader>Upload Image Here</ModalHeader>
                        <ModalBody>
                            <FileUploader
                                onDrop={(acceptedFiles) => {
                                    uploadRestImage(acceptedFiles);
                                }}
                                progressMessage={
                                    isUploading ? `Uploading... hang tight.` : ''
                                }
                            />
                        </ModalBody>
                        <ModalFooter>
                            <ModalButton kind="tertiary" onClick={() => setModalIsOpen(false)}>
                                Cancel
                            </ModalButton>
                            <ModalButton onClick={uploadRestImage}>Okay</ModalButton>
                        </ModalFooter>
                    </Modal>
                </Col>
                <Col>
                    <center>
                        <h2>
                            <H2> Details </H2>
                        </h2>
                        <form onSubmit={updateRest}>
                            <div style={{ textAlign: "left", width: "80%" }}>

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
                                                desc: e.taret.vgalue,
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
                                            { city: "San Jose" },
                                            { city: "San Francisco" },
                                            { city: "San Diego" },
                                        ]}
                                        valueKey="city"
                                        labelKey="city"
                                        placeholder=""
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
                                        placeholder=""
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
                                        placeholder=""
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

                            </div>

                            <Button
                                variant="primary"
                                disabled={isUpdating}
                                type="submit"
                            >
                                {isUpdating ? 'Updating…' : 'Click to Update'}
                            </Button>
                        </form>
                    </center>
                </Col>
            </Row>
        </div>
    );
}

export default UpdateRestaurant;
