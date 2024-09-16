'use client';
import { Container, Typography, Button, Grid, AppBar, Toolbar, Box, IconButton } from '@mui/material';
import Link from 'next/link';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/Footer";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function Home() {
  return (
    <>
      <Box sx={{ flexGrow: 1, bgcolor: '#121212', minHeight: '100vh', color: '#ffffff' }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#1e1e1e', boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)', borderBottom: '4px solid orange' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bolder', color: 'orange', marginRight: 2, display: 'flex', alignItems: 'center' }}>
              Query  <PictureAsPdfIcon sx={{ marginRight: 1 }} />
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="#home" passHref>
              <Button color="inherit" sx={{ color: 'orange' }}>Home</Button>
            </Link>
            <Link href="#features" passHref>
              <Button color="inherit" sx={{ color: 'orange' }}>Features</Button>
            </Link>
            <Link href="#team" passHref>
              <Button color="inherit" sx={{ color: 'orange' }}>Team</Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>


        <Container id="home" maxWidth="md" sx={{ textAlign: 'center', marginTop: 8, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{
            fontWeight: 'bold', fontFamily: 'Roboto, sans-serif', color: '#ffffff', letterSpacing: '2px',
            textShadow: '0 0 15px rgba(255, 255, 255, 0.6)'
          }}>
            Welcome to Query PDF
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom sx={{
            fontFamily: 'Roboto, sans-serif', color: '#bbbbbb',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
          }}>
            Instantly Access Comprehensive Summaries and Detailed Answers from Your PDFs.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center'
            }}
          >
            <Link href="/chat" passHref legacyBehavior>
            <Button variant="contained" size="large" sx={{
                backgroundColor: 'orange', 
                color: 'white', 
                textTransform: 'none', 
                fontWeight: 'bold', 
                borderRadius: '50px',
                padding: '14px 40px', 
                marginBottom: 2, 
                marginRight: { xs: 0, sm: 2 }, 
                ':hover': { 
                    backgroundColor: '#ff8f05',
                }
            }}>
                Query your PDF now
            </Button>
            </Link>
          </Box>
        </Container>

        <Container id="features" maxWidth="md" sx={{ textAlign: 'center', marginTop: 8, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{
            textAlign: 'center', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif', color: '#ffffff',
            letterSpacing: '1px', mb: 4
          }}>
            Features
          </Typography>
          <Grid container spacing={6} textAlign="center">
            <Grid item xs={12} sm={4}>
              <Box sx={{
                bgcolor: '#1e1e1e', borderRadius: '15px', padding: 4, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)', cursor: 'pointer',
                height: '120%', transition: 'transform 0.3s, box-shadow 0.3s', ':hover': { transform: 'scale(1.05)', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)' },
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{
                  color: 'orange', fontFamily: 'Roboto, sans-serif', textShadow: '0 0 8px rgba(233, 30, 99, 0.6)'
                }}>
                  Get Summary of Your PDF Directly After Upload
                </Typography>
                <Typography color="textSecondary" sx={{
                  color: '#bbbbbb', fontFamily: 'Roboto, sans-serif', textShadow: '0 0 5px rgba(255, 255, 255, 0.5)', mb: 2
                }}>
                  Instantly receive a summary of your PDF as soon as you upload it for quick insights.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{
                bgcolor: '#1e1e1e', borderRadius: '15px', padding: 4, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)', cursor: 'pointer',
                height: '120%', transition: 'transform 0.3s, box-shadow 0.3s', ':hover': { transform: 'scale(1.05)', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)' },
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{
                  color: 'orange', fontFamily: 'Roboto, sans-serif', textShadow: '0 0 8px rgba(233, 30, 99, 0.6)'
                }}>
                  Ask Questions About the PDF File
                </Typography>
                <Typography color="textSecondary" sx={{
                  color: '#bbbbbb', fontFamily: 'Roboto, sans-serif', textShadow: '0 0 5px rgba(255, 255, 255, 0.5)', mb: 2
                }}>
                  Pose questions about the contents of your PDF and get precise answers based on the document.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{
                bgcolor: '#1e1e1e', borderRadius: '15px', padding: 4, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)', cursor: 'pointer',
                height: '120%', transition: 'transform 0.3s, box-shadow 0.3s', ':hover': { transform: 'scale(1.05)', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)' },
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{
                  color: 'orange', fontFamily: 'Roboto, sans-serif', textShadow: '0 0 8px rgba(233, 30, 99, 0.6)'
                }}>
                  Voice Interaction
                </Typography>
                <Typography color="textSecondary" sx={{
                  color: '#bbbbbb', fontFamily: 'Roboto, sans-serif', textShadow: '0 0 5px rgba(255, 255, 255, 0.5)', mb: 2
                }}>
                  Interact with your PDF using voice commands for a hands-free experience.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <Container id="team" maxWidth="md" sx={{ textAlign: 'center', marginTop: 8, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{
            textAlign: 'center', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif', color: '#ffffff',
            letterSpacing: '1px', mb: 4
          }}>
            Meet the Team
          </Typography>
          <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{
                bgcolor: '#1e1e1e', borderRadius: '15px', padding: 4, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s, box-shadow 0.3s', ':hover': { transform: 'scale(1.05)', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)' }
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
                  color: 'orange', fontFamily: 'Roboto, sans-serif'
                }}>
                  Ayesha Mahmood
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconButton component="a" href="https://github.com/mahmoodayesha" target="_blank" sx={{ color: 'white' }}>
                    <GitHubIcon />
                  </IconButton>
                  <IconButton component="a" href="https://www.linkedin.com/in/mahmood-ayesha/" target="_blank" sx={{ color: 'white' }}>
                    <LinkedInIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{
                bgcolor: '#1e1e1e', borderRadius: '15px', padding: 4, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s, box-shadow 0.3s', ':hover': { transform: 'scale(1.05)', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)' }
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
                  color: 'orange', fontFamily: 'Roboto, sans-serif'
                }}>
                  Abdullah Bin Altaf
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconButton component="a" href="https://github.com/abdullah-k18" target="_blank" sx={{ color: 'white' }}>
                    <GitHubIcon />
                  </IconButton>
                  <IconButton component="a" href="https://www.linkedin.com/in/abdullah-k18/" target="_blank" sx={{ color: 'white' }}>
                    <LinkedInIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <Footer />
      </Box>
      <Analytics />
    </>
  );
}
