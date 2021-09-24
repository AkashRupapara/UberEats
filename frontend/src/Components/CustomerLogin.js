import React from 'react';
import logo from '../assets/images/ubereats.png';
import '../assets/css/home.css'
import { Select } from "baseui/select";
import { Button, SHAPE } from 'baseui/button';
import { Input } from 'baseui/input';
import axiosInstance from '../axiosConfig';
import { useDispatch } from 'react-redux';
import { loginCustomerRequest, loginCustomerSuccess, loginCustomerFailure } from '../actions/customer';

function CustomerLogin() {
  const [emailId, setEmailId] = React.useState('');
  const [password, setPassword] = React.useState('');

  const dispatch = useDispatch();

  const customerLogin = async (e) => {
    dispatch(loginCustomerRequest());
    e.preventDefault();
    try {
      const data = {
        email: emailId,
        password: password,
      }
      const response = await axiosInstance.post('auth/login', data)
      dispatch(loginCustomerSuccess(response));
      localStorage.setItem('token', response.data.token)
    } catch (err) {
      console.log(err)
      dispatch(loginCustomerFailure(err));
    }

  }

  return (
    <div className="flexbox-container login">
      <img src={logo} alt="Logo" style={{ width: '20%' }} />
      <h1 style={{ textDecoration: 'none', fontFamily: 'sans-serif' }}> Welcome Back </h1>
      <form onSubmit={customerLogin}>
        <div style={{ width: '40vw', margin: '2%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h2> Email Id </h2>
          <Input
            value={emailId}
            onChange={event => setEmailId(event.currentTarget.value)}
            placeholder="Controlled Input"
            type="email"
          />
          <h2> Password </h2>

          <Input
            value={password}
            onChange={event => setPassword(event.currentTarget.value)}
            placeholder="Controlled Input"
            type="password"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '40vw' }}>
          <Button shape={SHAPE.pill}
            className="home-button"
            type="submit"
          >
            Login
          </Button>
        </div>
      </form>
      <br></br>
      <a href="/customerRegistration"> Sign Up </a>
    </div>
  );
}

export default CustomerLogin;
