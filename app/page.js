'use client';
import { Container, Typography, Button, Grid, Card, CardContent, AppBar, Toolbar, Box, IconButton } from '@mui/material';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'; 
import GitHubIcon from '@mui/icons-material/GitHub';
import { Analytics } from "@vercel/analytics/react";
import Image from 'next/image';

import Head from 'next/head';
import Footer from "@/components/Footer";

export default function Home() {
  
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    })

    if (error) {
      console.warn(error.message)
    }
  }
  
  return <>
  <Box sx={{ flexGrow: 1, bgcolor: '#121212', minHeight: '100vh', color: '#ffffff' }}>

    {/* Navbar */}
    <AppBar position="static" sx={{ backgroundColor: '#1e1e1e', boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)', borderBottom: '4px solid orange' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
       
          
        </Box>

        {/* User buttons on the right end */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" passHref legacyBehavior>
              <Button
                color="inherit"
                sx={{
                  color: '#ffffff',
                  textTransform: 'none',
                  marginRight: 2,
                  fontWeight: 'bold',
                  borderRadius: '20px',
                  ':hover': { color: 'orange', textShadow: '0 0 10px rgba(233, 30, 99, 0.5)' },
                }}
              >
                Log In
              </Button>
            </Link>
            <Link href="/sign-up" passHref legacyBehavior>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'orange',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  borderRadius: '25px',
                  padding: '6px 12px',
                  boxShadow: '0 4px 15px rgba(233, 30, 99, 0.4)',
                  ':hover': { backgroundColor: 'skyblue', boxShadow: '0 6px 20px rgba(0, 30, 99, 0.6)' },
                }}
              >
                Create Account
              </Button>
            </Link>
          </SignedOut>
        </Box>
      </Toolbar>
    </AppBar>


    {/* Hero Section */}
    <Container maxWidth="md" sx={{ textAlign: 'center', marginTop: 8 }}>
  <Typography variant="h3" gutterBottom sx={{
    fontWeight: 'bold', fontFamily: 'Roboto, sans-serif', color: '#ffffff', letterSpacing: '2px',
    textShadow: '0 0 15px rgba(255, 255, 255, 0.6)'
  }}>
    Welcome to PDF Query Quest
  </Typography>
  <Typography variant="h5" color="textSecondary" gutterBottom sx={{
    fontFamily: 'Roboto, sans-serif', color: '#bbbbbb',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
  }}>
    Your ultimate tool for exploring and extracting information from PDFs. Ask any questions about the PDF content, and get answers instantly!

  </Typography>
  <Box
    component="img"
    src="/Image.png"
    alt="pdf planner"
    sx={{
      maxWidth: '100%', height: 'auto', borderRadius: '25px', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
      marginTop: 4, marginBottom: 4, transition: 'transform 0.5s', ':hover': { transform: 'scale(1.05)' }
    }}
  />
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      flexDirection: { xs: 'column', sm: 'row' }, 
      alignItems: 'center' 
    }}
  >
    <Link href="/test-upload" passHref legacyBehavior>
      <Button variant="contained" size="large" sx={{
        backgroundColor: 'orange', color: 'white', textTransform: 'none', fontWeight: 'bold', borderRadius: '50px',
        padding: '14px 40px', marginBottom: 2, marginRight: { xs: 0, sm: 2 }, boxShadow: '0 6px 20px rgba(0, 30, 99, 0.4)',
        ':hover': { backgroundColor: 'skyblue', boxShadow: '0 8px 25px rgba(0, 30, 99, 0.6)' }
      }}>
        Start Your PDF Chat & Get Quick Results
      </Button>
    </Link>
  
  </Box>
</Container>


    {/* Features Section */}
    <Container maxWidth="lg" sx={{ marginBottom: 12 }}>
      <Grid container spacing={6} textAlign="center">
        <Grid item xs={12} sm={4}>
          <Box sx={{
            bgcolor: '#1e1e1e', borderRadius: '15px', padding: 4, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            height: '120%', transition: 'transform 0.3s, box-shadow 0.3s', ':hover': { transform: 'scale(1.05)', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)' }
          }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{
              color: 'orange', fontFamily: 'Roboto, sans-serif', textShadow: '0 0 8px rgba(233, 30, 99, 0.6)'
            }}>
              Personalized Recommendations
            </Typography>
            <Typography color="textSecondary" sx={{
              color: '#bbbbbb', fontFamily: 'Roboto, sans-serif', textShadow: '0 0 5px rgba(255, 255, 255, 0.5)'
            }}>
              Get information from your PDF tailored to your queries.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{
            bgcolor: '#1e1e1e', borderRadius: '15px', padding: 4, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            height: '120%', transition: 'transform 0.3s, box-shadow 0.3s', ':hover': { transform: 'scale(1.05)', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)' }
          }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{
              color: 'orange', fontFamily: 'Roboto, sans-serif', textShadow: '0 0 8px rgba(233, 30, 99, 0.6)'
            }}>
             Comprehensive PDF Insights 

            </Typography>
            <Typography color="textSecondary" sx={{
              color: '#bbbbbb', fontFamily: 'Roboto, sans-serif', textShadow: '0 0 5px rgba(255, 255, 255, 0.5)'
            }}>
              Explore detailed insights from your PDF and find exactly what you need.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{
            bgcolor: '#1e1e1e', borderRadius: '15px', padding: 4, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            height: '120%', transition: 'transform 0.3s, box-shadow 0.3s', ':hover': { transform: 'scale(1.05)', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)' }
          }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{
              color: 'orange', fontFamily: 'Roboto, sans-serif', textShadow: '0 0 8px rgba(233, 30, 99, 0.6)'
            }}>
              Smart Summaries

            </Typography>
            <Typography color="textSecondary" sx={{
              color: '#bbbbbb', fontFamily: 'Roboto, sans-serif', textShadow: '0 0 5px rgba(255, 255, 255, 0.5)'
            }}>
              Receive concise summaries of complex sections to quickly understand the key points.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>

    {/* Footer */}
    <Footer />

  </Box>
  <Analytics/>
 </>;
}
