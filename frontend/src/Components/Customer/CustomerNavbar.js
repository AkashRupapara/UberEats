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
import {useHistory} from 'react-router';
import logo from "../../assets/images/ubereats.png";
import cartLogo from "../../assets/images/cartIcon.jpg";
import { Menu } from "baseui/icon";
import { Button, KIND } from "baseui/button";
import { Col, Form, Row } from "react-bootstrap";
import { Drawer, ANCHOR } from "baseui/drawer";
import { Avatar } from "baseui/avatar";
import { useStyletron, expandBorderStyles } from "baseui/styles";

function CustomerNavbar() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const history = useHistory();
  const [itemDisable, setItemDisable] = React.useState(false);

  React.useEffect(() => {

     if(history.location.pathname === "/customer/update"){
         setItemDisable(true);
     }else{
         setItemDisable(false);
     }
  }, [history.location.pathname]);

  return (
    <HeaderNavigation style={{ height: "90px" }}>
      <NavigationList $align={ALIGN.left}>
        <Button kind={KIND.minimal} onClick={() => setIsDrawerOpen(true)}>
          <Menu />
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
            <div style={{marginTop: "10%"}}>    
              <div style={{marginTop: "5%"}}>
                <Button style={{width: "100%"}} onClick={()=> history.push('/customer/update')}> Update Profile </Button>
              </div>
              <div  style={{marginTop: "5%"}}>
                <Button style={{width: "100%"}}> Past Orders </Button>
              </div>
              <div  style={{marginTop: "5%"}}>
                <Button style={{width: "100%"}}> Favorites </Button>
              </div>
            </div>
          </Drawer>
        </Button>
        <NavigationItem>
          <a href="/customer/dashboard"><img src={logo} style={{ width: "100px", height: "70px" }} /></a>
        </NavigationItem>
      </NavigationList>
      <NavigationList $align={ALIGN.center}>
        <label
          class="toggleSwitch nolabel"
          onclick=""
          style={{ marginTop: "3%" }}
        >
          <input type="checkbox" disabled={itemDisable}/>
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
          <img src={cartLogo} style={{ height: "80px" }} />
        </NavigationItem>
      </NavigationList>
    </HeaderNavigation>
  );
}

export default CustomerNavbar;
