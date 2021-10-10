import * as React from "react";
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationItem as NavigationItem,
  StyledNavigationList as NavigationList,
} from "baseui/header-navigation";

import { Card, StyledBody, StyledAction, StyledThumbnail } from "baseui/card";

import { StatefulSelect as Search, TYPE } from "baseui/select";
import "../../assets/css/customerNavbar.css";
import { useHistory } from "react-router";
import logo from "../../assets/images/ubereats.png";
import cartLogo from "../../assets/images/cartIcon.jpg";
import { Menu } from "baseui/icon";
import { Button, KIND } from "baseui/button";
import { Col, Form, Row } from "react-bootstrap";
import { Drawer, ANCHOR } from "baseui/drawer";
import { Avatar } from "baseui/avatar";
import { useStyletron, expandBorderStyles } from "baseui/styles";
import axiosConfig from "../../axiosConfig";
import toast from "react-hot-toast";
import { H3, H5 } from "baseui/typography";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from "baseui/modal";
import { useDispatch } from "react-redux";
import { setDeliveryTypeAction, setDishTypeAction, setLocation, setSearchKeyWordAction } from "../../actions/searchFilter";

function CustomerNavbar() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const history = useHistory();
  const [itemDisable, setItemDisable] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [cartDetails, setCartDetails] = React.useState({});
  const [orderInitModalIsOpen, setOrderInitModalIsOpen] = React.useState(false);
  const [deliveryType, setDeliveryType] = React.useState("Pickup");
  const [dishType, setDishType] = React.useState(null);
  const [keyWord, setKeyWord] = React.useState("");

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (history.location.pathname === "/customer/update" || history.location.pathname === "/customer/orders") {
      setItemDisable(true);
    } else {
      setItemDisable(false);
    }
  }, [history.location.pathname]);

  React.useEffect(() => {
    dispatch(setDeliveryTypeAction(deliveryType));
  }, [deliveryType]);
  
  React.useEffect(() => {
    dispatch(setSearchKeyWordAction(keyWord));
  }, [keyWord]);



  React.useEffect(() => {
    dispatch(setDishTypeAction(dishType));
  }, [dishType]);

  const deleteCartItems = () => {
    const token = localStorage.getItem("token");
    axiosConfig
      .delete("/cart/", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        toast.success("Cart Items Deleted");
        setCartDetails({});
        getCartItems();
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };

  const getCartItems = () => {
    const token = localStorage.getItem("token");
    axiosConfig
      .get("/cart/", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setCartDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Session Expired!! Please Sign In Again!!")
        history.push("/customer/login");
      });
  };

  React.useEffect(() => {
    getCartItems();
  }, [isCartOpen]);

  const deleteItemFromCart = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axiosConfig.delete(`cart/item/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      toast.success(res.data.message);
      getCartItems();
    } catch (err) {
      console.log(err.response.data.error);
      toast.error(err.response.data.error);
    }
  };

  const initOrder = () => {
    setOrderInitModalIsOpen(true);
  };

  const goToPlaceOrder = () => {
    const token = localStorage.getItem("token");

    axiosConfig
      .post(
        "/orders/neworder",
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        history.push(`/customer/placeorder/${res.data.orderId}`);
      })
      .catch((err) => {
        console.log(err?.response?.data);
        toast.error(err?.response?.data?.error);
      });
    return;
  };

  return (
    <HeaderNavigation style={{ height: "90px" }}>
      <NavigationList $align={ALIGN.left}>
        <Button kind={KIND.minimal} onClick={() => setIsDrawerOpen(true)}>
          <Menu />
        </Button>
        <Drawer
          isOpen={isDrawerOpen}
          autoFocus
          anchor={ANCHOR.left}
          onClose={() => setIsDrawerOpen(false)}
        >
          <div>
            <Avatar
              overrides={{
                Root: {
                  style: ({ $theme }) => ({
                    ...expandBorderStyles($theme.borders.border500),
                  }),
                },
              }}
              name="Akash Rupapara"
              size="scale1400"
              src="https://not-a-real-image.png"
            />
          </div>
          <div style={{ marginTop: "10%" }}>
            <div style={{ marginTop: "5%" }}>
              <Button
                style={{ width: "100%" }}
                onClick={() => history.push("/customer/update")}
              >
                Update Profile
              </Button>
            </div>
            <div style={{ marginTop: "5%" }}>
              <Button style={{ width: "100%" }}
              onClick={()=>  history.push("/customer/orders")}> Past Orders </Button>
            </div>
            <div style={{ marginTop: "5%" }}>
              <Button style={{ width: "100%" }}
              onClick={()=>  history.push("/customer/fvrts")}> Favorites </Button>
            </div>
          </div>
        </Drawer>
        <NavigationItem>
          <a href="/customer/dashboard">
            <img src={logo} style={{ width: "100px", height: "70px" }} />
          </a>
        </NavigationItem>
      </NavigationList>
      <NavigationList $align={ALIGN.center}>
        <label
          class="toggleSwitch nolabel"
          onclick=""
          style={{ marginTop: "3%" }}
        >
          <input type="checkbox" disabled={itemDisable}  />
          <a></a>
          <span>
            <span class="left-span" onClick={(e)=>{setDeliveryType("Pickup")}}>Pickup</span>
            <span class="right-span" onClick={(e)=>{setDeliveryType("Delivery")}}>Delivery</span>
          </span>
        </label>
      </NavigationList>
      <NavigationList $align={ALIGN.right}>
        <NavigationItem style={{ marginTop: "3%" }}>
          <Row>
            <Col>
              <div
                style={{
                  display: "flex",
                  border: "1px solid #777",
                  padding: "0 10px",
                  borderRadius: "25px",
                }}
              >
                <Form.Control
                  as="select"
                  custom
                  style={{
                    height: "30px",
                    marginBottom: "10%",
                    border: "0",
                    backgroundColor: "transparent",
                  }}
                  onChange={(e)=>{setDishType(e.target.value)}}
                  disabled={itemDisable}
                >
                  <option value="">Any</option>
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Vegan">Vegan</option>
                </Form.Control>
              </div>
            </Col>
            <Col>
              <div
                style={{
                  display: "flex",
                  border: "1px solid #777",
                  padding: "0 10px",
                  borderRadius: "25px",
                }}
              >
                <Form.Control
                  as="select"
                  custom
                  style={{
                    height: "30px",
                    marginBottom: "10%",
                    border: "0",
                    backgroundColor: "transparent",
                  }}
                  disabled={itemDisable}
                  onChange={(e)=>{dispatch(setLocation(e.target.value))}}
                >
                  <option value="">All</option>
                  <option value="San Jose">San Jose</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="Santa Cruz">Santa Cruz</option>
                  <option value="Santa Clara">Santa Clara</option>
                </Form.Control>
              </div>
            </Col>
          </Row>
        </NavigationItem>
      </NavigationList>
      <NavigationList>
        <NavigationItem style={{ width: "400px" }}>
          <div
            style={{
              display: "flex",
              border: "1px solid #777",
              padding: "0 10px",
              borderRadius: "25px",
            }}
          ></div>
          <Search
            style={{
              border: "0",
              backgroundColor: "transparent",
              marginBottom: "10%",
            }}
            disabled={itemDisable}
            type={TYPE.search}
            getOptionLabel={(props) => props.option.id || null}
            onInputChange={(e) => setKeyWord(e.target.value)}
          />
        </NavigationItem>
        <NavigationItem>
          <div>
            <img
              src={cartLogo}
              style={{ height: "80px" }}
              onClick={() => setIsCartOpen(true)}
            />
          </div>
          <Drawer
            isOpen={isCartOpen}
            autoFocus
            anchor={ANCHOR.right}
            onClose={() => setIsCartOpen(false)}
          >
            <div>
              <h3> Cart Items</h3>
            </div>
            <div style={{ marginTop: "10%", textAlign: "center" }}>
              {cartDetails
                ? cartDetails.cartItems?.length > 0
                  ? cartDetails.cartItems.map((item) => {
                      return (
                        <div
                          className="card mb-3"
                          style={{ width: "100%", height: "80px" }}
                        >
                          <div className="row no-gutters">
                            <div className="col-md-4">
                              <img
                                src={
                                  item.dish.dish_imgs.length > 0
                                    ? item.dish.dish_imgs[0].di_img
                                    : null
                                }
                                style={{
                                  height: "80px",
                                  width: "100%",
                                  marginLeft: "-28px",
                                }}
                              />
                              <title>Placeholder</title>
                              <rect width="100%" height="100%" fill="#868e96" />
                            </div>
                            <div className="col-md-5">
                              <div className="card-body">
                                <h5 className="card-title">
                                  {item.dish.d_name}
                                </h5>
                                <p className="card-text">
                                  {cartDetails.restDetails.r_name}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="card-body">
                                <Button
                                  onClick={() => {
                                    deleteItemFromCart(item.cart_id);
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : null
                : null}
            </div>
            {cartDetails.cartItems?.length > 0 ? (
              <div>
                <p>
                  <Button style={{ width: "100%" }} onClick={deleteCartItems}>
                    Clear Cart
                  </Button>
                </p>
                <p>
                  <Button style={{ width: "100%" }} onClick={initOrder}>
                    Initiate Order
                  </Button>
                </p>
              </div>
            ) : (
              <H5>"NO ITEMS IN CART"</H5>
            )}
          </Drawer>
          <Modal
            onClose={() => setOrderInitModalIsOpen(false)}
            isOpen={orderInitModalIsOpen}
          >
            <ModalHeader>
              <H3> {cartDetails?.restDetails?.r_name}</H3>
            </ModalHeader>
            <ModalBody>
              {cartDetails?.cartItems?.length > 0
                ? cartDetails.cartItems.map((item) => {
                    return (
                      <Row>
                        <Col>{item?.dish?.d_name}</Col>
                        <Col>${item?.dish?.d_price}</Col>
                        <hr />
                      </Row>
                    );
                  })
                : ""}
            </ModalBody>
            <ModalFooter>
              <ModalButton
                kind="tertiary"
                onClick={() => setOrderInitModalIsOpen(false)}
              >
                Cancel
              </ModalButton>
              <ModalButton onClick={goToPlaceOrder}>Place Order</ModalButton>
            </ModalFooter>
          </Modal>
        </NavigationItem>
      </NavigationList>
    </HeaderNavigation>
  );
}
export default CustomerNavbar;
