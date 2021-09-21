import React from 'react';
import logo from '../assets/images/ubereats.png';
import { Button } from "baseui/button";

function Home() {
  return (
    <div className="home">
      <div>
        <img src={logo} alt="Logo" style={{ width: '30%' }} />
      </div>
      <div>
        <Button
          onClick={() => alert('click')}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                outline: `${$theme.colors.warning600} solid`,
                backgroundColor: $theme.colors.white,
                color:$theme.colors.black,
              }),
            },
          }}
        >
          Hello
        </Button>
      </div>
    </div>
  );
}

export default Home;
