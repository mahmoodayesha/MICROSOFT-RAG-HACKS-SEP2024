import { Box, Typography } from '@mui/material';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{ 
        bgcolor: '#121212',
        color: '#ffffff',
        textAlign: 'center',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
        padding: 4,
        borderRadius: '15px',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          fontFamily: 'Roboto, sans-serif',
          marginBottom: 4,
          color: '#ffffff',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.6)',
        }}
      >
        Welcome Back
      </Typography>
      <SignIn routing="hash" />
    </Box>
  );
}
