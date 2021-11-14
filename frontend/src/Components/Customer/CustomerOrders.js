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
import { Pagination } from 'baseui/pagination';

function CustomerOrders() {
  const [allOrderDetails, setAllOrderDetails] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [orderModalIsOpen, setOrderModalIsOpen] = useState(false);
  const [filterOrderStatus, setFilterOrderStatus] = useState('All');
  const [isCancelled, setIsCancelled] = useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [limit, setLimit] = useState('5');
  const [pages, setPages] = useState(1);
  const [pagination, setPagination] = useState({});

  const history = useHistory();

  useEffect(() => {
    getFilteredOrders();
  }, [limit, currentPage, filterOrderStatus]);

  const getFilteredOrders = () => {
    let orderStatus = filterOrderStatus ? filterOrderStatus : null;
    const token = localStorage.getItem('token');

    console.log('limit', limit);
    if (filterOrderStatus === 'All') {
      orderStatus = null;
    }

    axiosConfig
      .get(`/orders/filterorders`, {
        params: {
          page: currentPage,
          limit,
          orderStatus,
        },
        headers: {
          Authorization: token,
        }, 
      })
      .then((res) => {
        console.log(res.data);
        setPagination({
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,

        });
        setAllOrderDetails(res.data.orders);
        // setPages(res.data.totalPages);
        // setCurrentPage(res.data.currentPage);
      })
      .catch((err) => {
        console.log(err);
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
        }
      )
      .then(async (res) => {
        await getFilteredOrders([{ label: 'All' }]);
        setIsCancelled(!isCancelled);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast.error(err.response.data.error);
          getFilteredOrders([{ label: 'All' }]);
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
      <Row style={{ height: '100px', marginTop: '3%', marginLeft: '3%', marginRight: '3%' }}>
        <Col>
          <center>
            <div>
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
                value={[{ label: filterOrderStatus }]}
                placeholder="Select Order Status"
                onChange={({ value }) => {
                  setFilterOrderStatus(value[0]?.label);
                }}
              />
            </div>
          </center>
        </Col>
        <Col>
          <Pagination
            numPages={pagination.totalPages}
            currentPage={currentPage}
            onPageChange={({ nextPage }) => {
              setCurrentPage(Math.min(Math.max(nextPage, 1), 20));
            }}
          />
        </Col>
        <Col>
          <Select
            options={[
              { label: '2', id: '#F0F8FF' },
              { label: '5', id: '#FAEBD7' },
              { label: '10', id: '#00FFFF' },
            ]}
            value={[{ label: limit }]}
            placeholder="Select Page Limit"
            onChange={async({ value }) => {
              await setLimit(value[0].label);
              await setCurrentPage(1);
            }}
          />
        </Col>
      </Row>
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
                          {order.status === 'Placed' || order.status === 'Initialized' ? (
                            <Button
                              onClick={() => {
                                cancelOrder(order._id);
                                setIsCancelled(!isCancelled);
                              }}
                              style={{ width: '100%' }}
                            >
                              Cancel Order
                            </Button>
                          ) : (
                            ''
                          )}
                        </div>
                        <div style={{ justifyContent: 'center', marginTop: '5%' }}>
                          {order.status === 'Initialized' ? (
                            <Button
                              onClick={() => {
                                history.push(`/customer/placeorder/${order._id}`);
                              }}
                              style={{ width: '100%' }}
                            >
                              Place Order
                            </Button>
                          ) : (
                            ''
                          )}
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
