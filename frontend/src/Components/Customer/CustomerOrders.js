import { H3, H4, H5, H6 } from 'baseui/typography';
import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axiosConfig from '../../axiosConfig';
import CustomerNavbar from './CustomerNavbar';
import { useHistory } from 'react-router';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton } from 'baseui/modal';
import { Select } from 'baseui/select';
import { Button } from 'baseui/button';

function CustomerOrders() {
  const [allOrderDetails, setAllOrderDetails] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [orderModalIsOpen, setOrderModalIsOpen] = useState(false);
  const [filterOrderStatus, setFilterOrderStatus] = useState([{ label: 'All' }]);
  const [isCancelled, setIsCancelled] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getFilteredOrders([{label: 'All'}]);
  }, []);

  const getFilteredOrders = (params) => {
    console.log(params)
    if (params === null || params === undefined || params.length > 0 || params[0]?.label === '' || params[0]?.label === 'All') {
      getCustOrders();
      return;
    }

    const orderStatus = params[0]?.label;
    const token = localStorage.getItem('token');
    axiosConfig
      .get(`/orders/filterorders`, {
        params: {
          orderStatus,
        },
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setAllOrderDetails(res.data);
      })
      .catch((err) => {
        toast.error('Error Fetching Filtered Records');
      });
  };

  const getOrderDetails = (oid) => {
    const token = localStorage.getItem('token');
    axiosConfig
      .get(`/orders/details/${oid}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setOrderDetails(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast.error('No Order Found');
        }
      });
  };

  const cancelOrder = (id) => {
    const token = localStorage.getItem('token');
    axiosConfig
      .put(
        `/orders/updatestatus/${id}`,
        {
          status: 'Cancelled',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      )
      .then(async (res) => {
        await getFilteredOrders([{label: 'All'}]);
        setIsCancelled(!isCancelled);
      })
      .catch((err) => {
        if(err.response.status === 400){
          toast.error(err.response.data.error);
          getFilteredOrders([{label: 'All'}]);
        }
        console.log(err);
      });
  };

  const getCustOrders = () => {
    const token = localStorage.getItem('token');
    axiosConfig
      .get('/orders/', {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setAllOrderDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  return (
    <div>
      <CustomerNavbar />
      <center>
        <div style={{ marginTop: '3%', width: '50%' }}>
          <Select
            options={[
              { label: 'All', id: '#F0F8FF' },
              { label: 'Placed', id: '#F0F8FF' },
              { label: 'On the Way', id: '#FAEBD7' },
              { label: 'Picked Up', id: '#FAEBD7' },
              { label: 'Preparing', id: '#FAEBD7' },
              { label: 'Ready', id: '#FAEBD7' },
              { label: 'Delivered', id: '#FAEBD7' },
              { label: 'Cancelled', id: '#FAEBD7' },
            ]}
            valueKey="label"
            labelKey="label"
            value={filterOrderStatus}
            placeholder="Select Order Status"
            onChange={({ value }) => {
              setFilterOrderStatus(value);
              getFilteredOrders(value);
            }}
          />
        </div>
      </center>
      <Modal onClose={() => setOrderModalIsOpen(false)} isOpen={orderModalIsOpen}>
        <div style={{ margin: '5%' }}>
          <ModalHeader>Reciept</ModalHeader>
          <hr />
          <ModalBody>
            <Row>
              <H4>{orderDetails.restName}</H4>
            </Row>
            <Row>
              <Col style={{ textAlign: 'left' }}>
                <H5>Total</H5>
              </Col>
              <Col xs={4}>
                <H6> $ {orderDetails.finalOrderPrice}</H6>
              </Col>
            </Row>
            {orderDetails.dishes && orderDetails.dishes.length > 0
              ? orderDetails.dishes.map((dish) => {
                  return (
                    <Row>
                      <Col style={{ textAlign: 'left' }}>{dish?.name}</Col>
                      <Col xs={4}>${(dish?.totalPrice / dish?.qty).toFixed(2)}</Col>
                    </Row>
                  );
                })
              : null}
            <hr />
            <Row>
              <Col style={{ textAlign: 'left' }}>Order Address:</Col>
              <Col style={{ textAlign: 'right' }}>{orderDetails.orderAddress}</Col>
            </Row>
            <Row>
              <Col style={{ textAlign: 'left' }}>Notes:</Col>
              <Col style={{ textAlign: 'right' }}>{orderDetails.notes}</Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <ModalButton onClick={() => setOrderModalIsOpen(false)}>Okay</ModalButton>
          </ModalFooter>
        </div>
      </Modal>
      <div>
        <Row style={{ margin: '1% 5% 5% 5%' }}>
          <H3 style={{ textAlign: 'left' }}>Past Orders</H3>
          {allOrderDetails
            ? allOrderDetails.length > 0
              ? allOrderDetails.map((order) => (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        marginLeft: '-27px',
                        marginTop: '20px',
                      }}
                    >
                      <Col>
                        <img
                          className="col-sm-12"
                          src={order?.restImage ? order.restImage : ''}
                          alt="sans"
                          style={{ height: '100%' }}
                          onClick={() => history.push(`/customer/restaurant/${order?.restId}`)}
                        />
                      </Col>
                      <Col xs={7} style={{ textAlign: 'left', marginLeft: '2%' }}>
                        <H5>
                          <a onClick={() => history.push(`/customer/restaurant/${order?.restId}`)}>
                            {order.restName}
                          </a>
                          ({order.status})
                        </H5>
                        <p>
                          Total Items: {order.dishes.length} <br />
                          Total Price: ${order.finalOrderPrice} <br />
                          Order Place: {new Date(order.updatedAt).toUTCString()} <br />
                          Order Type: {order.orderType} <br />
                          <br />
                          <span
                            className="hoverUnderline"
                            style={{ fontWeight: 'bold' }}
                            onClick={async () => {
                              await getOrderDetails(order._id);
                              setOrderModalIsOpen(true);
                            }}
                          >
                            View receipt
                          </span>
                        </p>
                      </Col>
                      <Col style={{ marginRight: '45px' }}>
                        <div style={{ justifyContent: 'center' }}>
                          <Button
                            disabled={
                              order.status === 'Placed' || order.status === 'Initialized'
                                ? false
                                : true
                            }
                            onClick={() => {cancelOrder(order._id); setIsCancelled(!isCancelled)}}
                          >
                            Cancel Order
                          </Button>
                        </div>
                      </Col>
                    </div>
                    <hr />
                  </>
                ))
              : null
            : null}
        </Row>
      </div>
    </div>
  );
}

export default CustomerOrders;
