import { 
    Box,
    Container,
    IconButton,
    Link,
    Typography,
  } from "@mui/material"
import GitHubIcon from '@mui/icons-material/GitHub';
import FeedbackIcon from '@mui/icons-material/Feedback';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

export const Footer = () => {
    return (
    <>
   
   {/* Footer */}
    <Box sx={{
        bgcolor: '#1e1e1e', padding: 1, borderTop: '4px solid orange', position: 'relative', bottom: 0, width: '100%', color: '#fff'
      }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>

          {/* Feedback form */}
         
          {/* Social media icons */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
           
            <IconButton component="a" href="https://github.com/mahmoodayesha" target="_blank" sx={{ color: '#888' }}>
              <GitHubIcon />
            </IconButton>
            <IconButton component="a" href="https://github.com/abdullah-k18" target="_blank" sx={{ color: '#888' }}>
              <GitHubIcon />
            </IconButton>
          </Box>
          
          {/* Disclaimer */}
          <Typography variant="body1" color="" sx={{ marginBottom: 1, fontSize: 14, color: '#888' }}>
            © {new Date().getFullYear()} Microsoft RAGHACKS. All rights reserved.
          </Typography>
        </Container>
      </Box>
      </>
    )
}

export default Footer;