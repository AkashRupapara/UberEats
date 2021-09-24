import React from 'react';
import logo from '../assets/images/ubereats.png';
import '../assets/css/home.css'
import { Button, SHAPE } from 'baseui/button';
import { Input } from 'baseui/input';
import axiosInstance from '../axiosConfig';
import { useDispatch } from 'react-redux';
import { registerCustomerRequest, registerCustomerSuccess, registerCustomerFailure } from '../actions/customer';
import {Datepicker} from 'baseui/datepicker';
import toast from 'react-hot-toast';


function CustomerRegistration() {
    const [emailId, setEmailId] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [name, setName] = React.useState('');
    // const [dateOfBirth, setDateOfBirth] = React.useState('');
    // const [city, setCity] = React.useState('');
    // const [stateName, setStateName] = React.useState('');
    // const [country, setCountry] = React.useState('');
    // const [contact, setContact] = React.useState('');
    // const [nname, setNickName] = React.useState('');

    const dispatch = useDispatch();

    const customerRegister = async (e) => {
        dispatch(registerCustomerRequest());
        e.preventDefault();

        try {
            const data = {
                email: emailId,
                password: password,
                name: name,
            }
            const response = await axiosInstance.post('auth/register', data)
            dispatch(registerCustomerSuccess(response));
            localStorage.setItem('token', response.data.token)
        } catch (err) {
            toast.error(err.response.data.error)                    
            dispatch(registerCustomerFailure(err.response.data.error));
        }
    }

    return (
        <div className="flexbox-container login">
            <img src={logo} alt="Logo" style={{ width: '20%' }} />
            <h1 style={{ textDecoration: 'none', fontFamily: 'sans-serif' }}> Let's Get Started </h1>
            <form onSubmit={customerRegister}>
                <div style={{ width: '40vw', margin: '2%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <p> Enter your email Id </p>
                    <Input
                        value={emailId}
                        onChange={event => setEmailId(event.currentTarget.value)}
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <p> Enter your password </p>

                    <Input
                        value={password}
                        onChange={event => setPassword(event.currentTarget.value)}
                        placeholder="Password"
                        type="password"
                        required
                    />
                    <p> Enter your name </p>
                    <Input
                        value={name}
                        onChange={event => setName(event.currentTarget.value)}
                        placeholder="Name"
                        type="text"
                        required
                    />
                    {/* <p> Date Of Birth </p>
                    <Datepicker
                        aria-label="Select a date"
                        value={dateOfBirth}
                        onChange={({ date }) => setDateOfBirth(date)}
                        formatString="yyyy-MM-dd"
                        placeholder="YYYY-MM-DD"
                        mask="9999-99-99"
                    />
                    <p> Enter your city </p>
                    <Input
                        value={city}
                        onChange={event => setCity(event.currentTarget.value)}
                        placeholder="City"
                        type="text"
                    />
                    <p> Enter your state </p>
                    <Input
                        value={stateName}
                        onChange={event => setStateName(event.currentTarget.value)}
                        placeholder="State Name"
                        type="text"
                    />
                    <p> Enter your Country </p>
                    <Input
                        value={country}
                        onChange={event => setCountry(event.currentTarget.value)}
                        placeholder="Country"
                        type="text"
                    />
                    <p> Enter your Number </p>
                    <Input
                        value={contact}
                        onChange={event => setContact(event.currentTarget.value)}
                        placeholder="Contact Number"
                        type="Number"
                    />
                    <p> Enter your Nick Name </p>
                    <Input
                        value={nname}
                        onChange={event => setNickName(event.currentTarget.value)}
                        placeholder="Nick Name"
                        type="text"
                    /> */}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', width: '40vw' }}>
                    <Button shape={SHAPE.pill}
                        className="home-button"
                        type="submit"
                    >
                        Register
                    </Button>
                </div>
            </form>
            <br></br>
            <p style={{ fontFamily: 'sans-serif', textDecoration: 'none', fontSize: 'large' }}> Already use UberEats ? <a href="/customerLogin" style={{color: 'green', textDecoration: 'none'}}> login </a></p>
        </div>
    );
}

export default CustomerRegistration;
