import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

function LoginScreen({ onLogin }) {
  return (
    <Container component="main" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Bem-vindo ao EPUB Scribe Studio!</Typography>
        <Typography sx={{ mt: 2, mb: 3, color: 'text.secondary' }}>Faça login para começar a criar e editar seus livros.</Typography>
        <Button variant="contained" size="large" onClick={onLogin}>
          Entrar com Google
        </Button>
      </Box>
    </Container>
  );
}

export default LoginScreen;