import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from "baseui/modal";

// import "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css";
// import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";

import { useDispatch } from "react-redux";
import { H3, H5, H6 } from "baseui/typography";
import toast from "react-hot-toast";
import { Button, SHAPE, SIZE } from "baseui/button";
import { Col, Row } from "react-bootstrap";
import axiosConfig from "../../axiosConfig";

const Carousel = require("react-responsive-carousel").Carousel;

function ShowDishModal(props) {
  const dispatch = useDispatch();
  const [conflictModalIsOpen, setConflictModalIsOpen] = useState(false);
  const [count, setCount] = useState(1);

  const {
    dishModalIsOpen,
    setDishModalIsOpen,
    dishes,
    selectedDishId,
    restId,
    restName,
  } = props;

  const [dishImages, setDishImages] = useState([]);
  const [dishDetails, setDishDetails] = useState({});
  const [prevRestName, setPrevRestName] = useState("");
  const [prevRestId, setPrevRestId] = useState("");

  useEffect(() => {
    if (dishes && selectedDishId) {
      let selectedDish = dishes.filter((dish) => dish._id === selectedDishId);
      if (selectedDish.length > 0) {
        setDishImages(selectedDish[0].dishImages);
        setDishDetails(selectedDish);
      }
    }
  }, [selectedDishId, dishes]);



  const resetCartItems = () => {
    const token = localStorage.getItem("token");
    axiosConfig
      .post(
        "/cart/reset",
        {
          dishId: selectedDishId,
          restId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        toast.success("Cart Updated");
        setDishModalIsOpen(false);
      })
      .catch((err) => {
        toast.error("Error Updating Cart");
      });
  };

  const addItemToCart = () => {
    const token = localStorage.getItem("token");
    axiosConfig
      .post(
        "/cart/add",
        {
          restId,
          dishId: selectedDishId,
          qty: count,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        toast.success("Item Added To Cart");
        setDishModalIsOpen(false);
      })
      .catch((err) => {
        if (err.response.status === 409) {
          setConflictModalIsOpen(true);
          setPrevRestName(err.response.data.restName);
          setPrevRestId(err.response.data.restId);
        }
      });
  };

  return (
    <div>
      <Modal
        onClose={() => setConflictModalIsOpen(false)}
        isOpen={conflictModalIsOpen}
      >
        <ModalHeader style={{ textAlign: "left" }}>
          <H3>Create new order?</H3>
        </ModalHeader>
        <ModalBody>
          <h6>
            Your order contains items from "{prevRestName}". Create a new order
            to add items from "{restName}"
          </h6>
        </ModalBody>
        <ModalFooter>
          <ModalButton
            kind="tertiary"
            onClick={() => setConflictModalIsOpen(false)}
          >
            Cancel
          </ModalButton>
          <ModalButton
            onClick={() => {
              resetCartItems();
              setConflictModalIsOpen(false);
            }}
          >
            Create
          </ModalButton>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={dishModalIsOpen}
        closeable
        size="35%"
        onClose={() => {setCount(1); setDishModalIsOpen(false); }}
      >
        {/* <ModalHeader> Edit Dish Details</ModalHeader> */}
        {/* <Row style={{ marginLeft: "5%" }}>
          <Col>
            <Carousel showArrows showThumbs={false}>
              {dishImages?.length > 0
                ? dishImages.map((ele) => (
                    <div style={{ height: "200px" }}>
                      <img src={ele.di_img} style={{ borderRadius: "20px" }} />
                    </div>
                  ))
                : null}
            </Carousel>
          </Col>
          <Col>
            
          </Col>
        </Row> */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Carousel autoPlay infiniteLoop interval={3000} transitionTime={1500} showArrows showThumbs={false} width="100%">
            {dishImages?.length > 0
              ? dishImages.map((ele) => (
                  <img src={ele.image}/>
                ))
              : null}
          </Carousel>
        </div>
        <div style={{ textAlign: "left", marginLeft: "5%", marginTop: "2%" }}>
          <Row style={{ paddingBottom: "-2px" }}>
            <Col>
              <H5>{dishDetails ? dishDetails[0]?.name : ""}</H5>
            </Col>
            <Col style={{ textAlign: "right", marginRight: "5%" }}>
              <H6>
                {dishDetails ? dishDetails[0]?.category + " - " : ""}
                {dishDetails ? dishDetails[0]?.dishType : ""}
              </H6>
            </Col>
          </Row>
          <hr />
          <h6>Description:</h6>
          <h6>
            <div style={{ color: "gray" }}>
              {dishDetails ? dishDetails[0]?.desc : ""}
            </div>
          </h6>
          <h6>Ingredients:</h6>
          <h6>
            <div style={{ color: "gray" }}>
              {dishDetails ? dishDetails[0]?.ingredients : ""}
            </div>
          </h6>
        </div>
        <hr />
        <ModalFooter>
          <Row style={{ marginTop: "-25px" }}>
            <Col style={{ textAlign: "left", marginTop: "10px" }}>
              Qty: 
              <Button size={SIZE.default} shape={SHAPE.circle} disabled={count===1?true:false} style={{ marginLeft:"10px"}} onClick={()=>setCount(count>1?count - 1:1)}>-</Button>
              <span style={{marginLeft:"10px", marginRight:"10px", fontSize:"20px"}}>{count}</span>
              <Button size={SIZE.default} shape={SHAPE.circle} onClick={()=>setCount(count + 1)}>+</Button>
            </Col>
            <Col>
              <Button onClick={() => addItemToCart()}> Add to Cart</Button>
            </Col>
          </Row>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ShowDishModal;
