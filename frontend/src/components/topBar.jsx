import React from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, Button } from '@mui/material';

function TopBar({ user, onLogout }) {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          EPUB Scribe Studio
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt={user.displayName} src={user.photoURL} sx={{ width: 32, height: 32, mr: 2 }} />
            <Button color="inherit" variant="outlined" size="small" onClick={onLogout}>Sair</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;