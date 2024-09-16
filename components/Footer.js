import { 
    Box,
    Container,
    IconButton,
    Typography,
  } from "@mui/material"
import GitHubIcon from '@mui/icons-material/GitHub';

export const Footer = () => {
    return (
    <>
      <Box sx={{
          bgcolor: '#1e1e1e', padding: 1, borderTop: '4px solid orange', position: 'relative', bottom: 0, width: '100%', color: '#fff'
        }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton component="a" href="https://github.com/mahmoodayesha" target="_blank" sx={{ color: '#888' }}>
              <GitHubIcon />
            </IconButton>
            <IconButton component="a" href="https://github.com/abdullah-k18" target="_blank" sx={{ color: '#888' }}>
              <GitHubIcon />
            </IconButton>
          </Box>
          <Typography variant="body1" color="" sx={{ marginBottom: 1, fontSize: 14, color: '#888' }}>
            © {new Date().getFullYear()} Query PDF. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
    )
}

export default Footer;