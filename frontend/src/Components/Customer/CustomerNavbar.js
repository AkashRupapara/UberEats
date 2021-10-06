import * as React from "react";
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationItem as NavigationItem,
  StyledNavigationList as NavigationList,
} from "baseui/header-navigation";
import { StyledLink as Link } from "baseui/link";
import { StatefulSelect as Search, TYPE } from "baseui/select";
import "../../assets/css/customerNavbar.css";

import logo from "../../assets/images/ubereats.png";
import cartLogo from "../../assets/images/cartIcon.jpg";

import { Col, Form, Row } from "react-bootstrap";

const options = {
  options: [
    { id: "AliceBlue", color: "#F0F8FF" },
    { id: "AntiqueWhite", color: "#FAEBD7" },
    { id: "Aqua", color: "#00FFFF" },
    { id: "Aquamarine", color: "#7FFFD4" },
    { id: "Azure", color: "#F0FFFF" },
    { id: "Beige", color: "#F5F5DC" },
    { id: "Bisque", color: "#FFE4C4" },
    { id: "Black", color: "#000000" },
  ],
  labelKey: "id",
  valueKey: "color",
  placeholder: "Search colors",
  maxDropdownHeight: "300px",
};

function CustomerNavbar() {
  return (
    <HeaderNavigation style={{height: "90px"}}>
      <NavigationList $align={ALIGN.left}>
        <NavigationItem>
          <img src={logo} style={{ width: "100px", height: "70px" }} />
        </NavigationItem>
      </NavigationList>
      <NavigationList $align={ALIGN.center}>
        <label
          class="toggleSwitch nolabel"
          onclick=""
          style={{ marginTop: "3%" }}
        >
          <input type="checkbox" />
          <a></a>
          <span>
            <span class="left-span">Pickup</span>
            <span class="right-span">Dilevery</span>
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
                    height: "20px",
                    marginBottom: "10%",
                    border: "0",
                    backgroundColor: "transparent",
                  }}
                >
                  <option value="All">All</option>
                  <option value="San Jose">San Jose</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="New York">New York</option>
                  <option value="Santa Clara">Santa Clara</option>
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
                    height: "20px",
                    marginBottom: "10%",
                    border: "0",
                    backgroundColor: "transparent",
                  }}
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
            type={TYPE.search}
            getOptionLabel={(props) => props.option.id || null}
            onChange={() => {}}
          />
        </NavigationItem>
        <NavigationItem>
          <img src={cartLogo} style={{ height: "80px" }} />
        </NavigationItem>
      </NavigationList>
    </HeaderNavigation>
  );
}

export default CustomerNavbar;
