import React from 'react';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div style={{
        display: "flex",
        marginRight: "auto",
        alignItems: "center",
        gap: "8px",
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <img
          src="chatgpt.png"
          alt="openai"
          width="30px"
          height="30px"
          className="image-inverted"
          color='inherit'
        />
        <Typography 
          sx={{
            display: { md: "block", sm: "none", xs: "none" },
            ml: 1, // add margin-left for spacing between image and text
            fontWeight: 800,
            textShadow: "2px 2px 20px #000",
            color: "inherit" // inherit color from parent to avoid blue link color
          }}
        >
        <span style={{fontSize: "20px" }}>ASK</span>-GPT
        </Typography>
      </Link>
    </div>
  );
};

export default Logo;
