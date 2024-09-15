
'use client';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { Box, Button, Container, Paper, Stack, Typography, TextField, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import Image from 'next/image';
import Footer from "@/components/Footer";
import BoltIcon from '@mui/icons-material/Bolt';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import HandymanIcon from '@mui/icons-material/Handyman';
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Divider from '@mui/material/Divider';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function PDFPage() {
  const [resume, setResume] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const router = useRouter();

  const handleUpload = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`/api/loader`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error uploading file`);
      }

      const data = await response.json();
      console.log("File upload response: ", data);

      const loadedContent = data.map((page) => page.pageContent).join('\n');
      setResume(loadedContent);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/query-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, resume }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch answer');
      }

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, bgcolor: '#121212', minHeight: '100vh', color: '#ffffff' }}>
        <Container maxWidth="md" sx={{ bgcolor: '#121212', minHeight: '100vh', color: '#ffffff' }}>
          <Box sx={{
            mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            {/* Home Icon */}
            <Button onClick={() => router.push('/')} sx={{ mb: 4 }}>
              <Image 
                src="/left-arrow.png"  
             
                width={100}  
                height={100}
                style={{ objectFit: 'contain', cursor: 'pointer' }}
              />
            </Button>
            <Typography variant="h4" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold', textShadow: '0 0 10px orange' }}>
            PDF Query Quest
            </Typography>

            <Paper sx={{ p: 4, width: '100%', bgcolor: '#2c2c2c', borderRadius: '8px' }}>
              {/* File Upload */}
              <Typography gutterBottom sx={{ color: '#ffffff' }}>
                Upload a PDF or ask a question related to the content.
              </Typography>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{
                  backgroundColor: 'default',
                  color: 'white',
                  '&:hover': { backgroundColor: 'blue' },
                }}
              >
                Upload PDF
                <VisuallyHiddenInput
                  type="file"
                  accept="application/pdf"
                  onChange={handleUpload}
                />
              </Button>

              {file && (
                <Typography sx={{ color: '#bbbbbb', mt: 2 }}>
                  {file.name} uploaded successfully!
                </Typography>
              )}

              <Divider sx={{ my: 4, bgcolor: 'orange' }} />

              <form onSubmit={handleSubmitQuestion} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <TextField
                  value={question}
                  minRows ={10}
                  multiline
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about the uploaded pdf"
                  variant="outlined"
                  sx={{
                    bgcolor: '#2c2c2c',
                    width: '100%',
                   
                    borderRadius: '8px',
                    color: '#ffffff',
                    '& .MuiInputBase-input': { color: '#ffffff' },
                    '& .MuiInputBase-input::placeholder': { color: '#ffffff' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'orange' },
                      '&:hover fieldset': { borderColor: 'darkorange' },
                      '&.Mui-focused fieldset': { borderColor: 'orange' },
                    },
                  }}
                />

                <Button 
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={!question.trim()}
                  sx={{
                    bgcolor: 'orange',
                    color: '#ffffff',
                    borderRadius: '25px',
                    ':hover': { bgcolor: 'darkorange' },
                    ':disabled': { bgcolor: '#bbb', color: '#888' }
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Get Answer'}
                </Button>
              </form>

              {error && <Typography sx={{ color: 'red', marginTop: 2 }}>{error}</Typography>}

              {answer && (
                <Box sx={{ marginTop: 4, bgcolor: '#2c2c2c', padding: 3, borderRadius: '12px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)' }}>
                  <Typography variant="h6" sx={{ color: '#ffffff', textAlign: 'center' }}>Answer</Typography>
                  <Typography sx={{ color: '#bbbbbb', marginTop: 2 }}>{answer}</Typography>
                </Box>
              )}
            </Paper>
          </Box>

          <Footer />
        </Container>
      </Box>
    </>
  );
}
