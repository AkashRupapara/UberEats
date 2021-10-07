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

function CustomerNavbar() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const history = useHistory();
  const [itemDisable, setItemDisable] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [cartDetails, setCartDetails] = React.useState({});

  React.useEffect(() => {
    if (history.location.pathname === "/customer/update") {
      setItemDisable(true);
    } else {
      setItemDisable(false);
    }
  }, [history.location.pathname]);

  const getCartItems = () => {
    const token = localStorage.getItem("token");
    axiosConfig
      .get("/cart/", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setCartDetails(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
        toast.error(err.response.data.error);
      });
  };
  console.log("Cart", cartDetails);
  React.useEffect(() => {
    getCartItems();
  }, [isCartOpen]);

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
                {" "}
                Update Profile{" "}
              </Button>
            </div>
            <div style={{ marginTop: "5%" }}>
              <Button style={{ width: "100%" }}> Past Orders </Button>
            </div>
            <div style={{ marginTop: "5%" }}>
              <Button style={{ width: "100%" }}> Favorites </Button>
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
          <input type="checkbox" disabled={itemDisable} />
          <a></a>
          <span>
            <span class="left-span">Pickup</span>
            <span class="right-span">Delivery</span>
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
                  disabled={itemDisable}
                >
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
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
                >
                  <option value="All">All</option>
                  <option value="San Jose">San Jose</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="New York">New York</option>
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
            onChange={() => {}}
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
            <div style={{ marginTop: "10%", textAlign:"center" }}>
              {cartDetails
                ? cartDetails.cartItems?.length > 0
                  ? cartDetails.cartItems.map((item) => {
                      return (
                        <div className="card mb-3" style={{ width: "80%", height:"80px" }}>
                          <div className="row no-gutters">
                            <div className="col-md-4">
                                <img src={item.dish.dish_imgs[0].di_img} style={{height:"80px", width:"100%", marginLeft:"-28px"}} />
                                <title>Placeholder</title>
                                <rect
                                  width="100%"
                                  height="100%"
                                  fill="#868e96"
                                />
                              {/* </svg> */}
                            </div>
                            <div className="col-md-8">
                              <div className="card-body">
                                <h5 className="card-title">{item.dish.d_name}</h5>
                                <p className="card-text">{cartDetails.restDetails.r_name}</p>
                                {/* <p className="card-text">
                                  <small className="text-muted">
                                    Card Text 2
                                  </small>
                                </p> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : null
                : null}
            </div>
          </Drawer>
        </NavigationItem>
      </NavigationList>
    </HeaderNavigation>
  );
}
export default CustomerNavbar;
