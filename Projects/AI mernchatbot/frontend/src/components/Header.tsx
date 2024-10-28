import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Logo from '../shared/Logo';
import { useAuth } from '../context/AuthContext';
import NavigationLink from '../shared/NavigationLink';

const Header = () => {
  const auth = useAuth();

  return (
    <AppBar sx={{ bgcolor: 'transparent', position: 'static', boxShadow: 'none' }}>
      <Toolbar sx={{ display: 'flex' }}>
        <Logo />
        <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
          {auth?.isLoggedIn ? (
            <>
              <NavigationLink bg="#00fffc" to="/chat" text="Chat Section" textColor="black" />
              <NavigationLink bg="#51538f" textColor="white" text="Logout" to="/" onClick={auth.logout} />
            </>
          ) : (
            <>
              <NavigationLink bg="#00fffc" to="/login" text="Login" textColor="black" />
              <NavigationLink bg="#51538f" to="/signup" text="Signup" textColor="black" />
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
