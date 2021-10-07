import React from 'react'
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import restLogo from '../../assets/images/ubereats-restaurant-logo.png'
import '../../assets/css/restaurantHome.css';
import { restaurantLogout } from '../../actions/restaurant';
import { useDispatch } from 'react-redux';
import {useHistory} from 'react-router'

const RestaurantNavbar = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const logoutHandler = () => {
        dispatch(restaurantLogout());
        history.push("/");
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/restaurant/dashboard"> <img src={restLogo} style={{ height: "20%", width: "30%" }} /></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">

                    </Nav>
                    <Nav>
                        <Nav.Link href="/restaurant/dashboard">Dashboard</Nav.Link>
                        <Nav.Link href="#pricing">Orders</Nav.Link>
                        <Nav.Link href="#deets">Customers</Nav.Link>
                        <Nav.Link href="/restaurant/update">Update Details</Nav.Link>

                        <Nav.Link onClick={logoutHandler}>logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default RestaurantNavbar
