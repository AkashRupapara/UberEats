import React from 'react';
import logo from '../assets/images/ubereats.png';
import '../assets/css/home.css'
import { Select } from "baseui/select";
import {Button, SHAPE} from 'baseui/button';


function Home() {
  const [value, setValue] = React.useState([]);

  return (
    <div className="flexbox-container home">
      <img src={logo} alt="Logo" style={{ width: '20%' }} />
      <div>
        <Select
          options={[
            { label: "Restaurant", id: "#F0F8FF" },
            { label: "Customer", id: "#FAEBD7" }
          ]}
          value={value}
          placeholder="Select Role"
          onChange={params => setValue(params.value)}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '40vw' }}>
        <Button shape={SHAPE.pill}
          className="home-button"
          onClick={() => alert('click')}
          // overrides={{
          //   BaseButton: {
          //     style: ({ $theme }) => ({
          //       outline: `${$theme.colors.warning600} solid`,
          //       backgroundColor: $theme.colors.green,
          //       color: $theme.colors.green,
          //     }),
          //   },
          // }}
        >
          Login
        </Button>
        <Button shape={SHAPE.pill}
          className="home-button"
          onClick={() => alert('click')}
        >
          Register
        </Button>
      </div>
    </div>
  );
}

export default Home;
