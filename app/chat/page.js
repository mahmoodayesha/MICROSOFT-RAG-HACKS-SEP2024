"use client";
import 'regenerator-runtime/runtime';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, IconButton, Stack, TextField, AppBar, Toolbar, Typography, Paper, Divider, Fade, CircularProgress, Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [query, setQuery] = useState("");

  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (listening) {
      setMessage(transcript);
    }
  }, [transcript, listening]);

  const handleUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await fetch('/api/loader', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Error uploading file');
      }

      const createSummaryResponse = await fetch('/api/create-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resume: await uploadResponse.text() }),
      });

      if (!createSummaryResponse.ok) {
        throw new Error('Error generating summary');
      }

      const data = await createSummaryResponse.json();
      const summary = data.summary || "Summary could not be generated.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Summary: ${summary}` },
      ]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error processing file." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    setLoading(true);
    const userMessage = message;
    setMessage("");
    resetTranscript();
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/query-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: userMessage }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        assistantMessage += text;
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          const otherMessages = prevMessages.slice(0, prevMessages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: assistantMessage },
          ];
        });
      }

      const utterance = new SpeechSynthesisUtterance(assistantMessage);
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const handleListen = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      sendMessage();
      setTimeout(() => {
        setMessage("");
        resetTranscript();
      }, 100);
    } else {
      resetTranscript();
      setMessage("");
      SpeechRecognition.startListening({ continuous: true });
    }
    setListening(!listening);
  };

  const handleQuery = async () => {
    if (!query.trim() || loading) return;

    setLoading(true);
    const userQuery = query;
    setQuery("");

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userQuery },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/query-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userQuery, resume: file }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const answer = data.answer || "No relevant information found.";

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: answer },
      ]);

    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ height: 60, backgroundColor: '#1e1e1e', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)', borderBottom: '4px solid orange' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={() => router.push('/')}>
            <ArrowBackIcon sx={{color: 'orange', fontSize: 'larger'}} />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold', color: 'orange' }}>
            <PictureAsPdfIcon  sx={{color: 'orange', fontSize: 'larger'}} />
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#121212', padding: 2 }}>
        <Paper
          elevation={5}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: { xs: '100%', sm: '600px' },
            height: { xs: '85vh', sm: '75vh' },
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: '#121212',
            color: '#fff',
          }}
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            p={3}
            sx={{
              overflowY: 'auto',
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#555",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#777",
              },
            }}
          >
            {messages.map((message, index) => (
              <Fade in={true} timeout={500} key={index}>
                <Box
                  display="flex"
                  justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      backgroundColor: message.role === "assistant" ? "#1e1e1e" : "orange",
                      color: "white",
                      borderRadius: "16px",
                      padding: "10px 15px",
                      maxWidth: "75%",
                      wordWrap: "break-word",
                      boxShadow: message.role === "assistant" ? '0 2px 10px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(0, 118, 255, 0.4)',
                    }}
                  >
                    {message.content}
                  </Box>
                </Box>
              </Fade>
            ))}
          </Stack>

          {loading && (
                        <Box display="flex" justifyContent="center" alignItems="center" py={1}>
                        <CircularProgress color="white" size={24} />
                      </Box>
                    )}
          
                    <Divider sx={{ backgroundColor: '#444' }} />
          
                    <Stack direction="row" spacing={1} p={1} alignItems="center">
                      <input
                        accept=".pdf"
                        style={{ display: "none" }}
                        id="file-upload"
                        type="file"
                        onChange={handleUpload}
                      />
                      <label htmlFor="file-upload">
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<CloudUploadIcon />}
                          sx={{
                            backgroundColor: "orange",
                            color: "white",
                            "&:hover": {
                              backgroundColor: '#ff8f05',
                            },
                          }}
                          disabled={loading}
                        >
                          Upload PDF
                        </Button>
                      </label>
                      {fileName && (
                        <Typography variant="caption" sx={{ p: 1, color: '#ccc', ml: 1 }}>
                          {fileName}
                        </Typography>
                      )}
                    </Stack>
          
                    <Stack direction="row" spacing={1} p={2}>
                      <TextField
                        placeholder="Ask a question about the document..."
                        fullWidth
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleQuery();
                          }
                        }}
                        disabled={!file || loading}
                        variant="outlined"
                        sx={{
                          input: {
                            color: "white",
                            backgroundColor: "#1e1e1e",
                            borderRadius: '16px',
                            padding: '10px 15px',
                            "&::placeholder": {
                              color: "#999",
                            },
                          },
                          fieldset: { borderColor: "transparent" },
                        }}
                      />
                      <IconButton
                        onClick={handleQuery}
                        sx={{
                          borderRadius: '50%',
                          backgroundColor: '#orange',
                          color: "white",
                          "&:hover": {
                            backgroundColor: '#orange',
                          },
                        }}
                        disabled={!file || loading}
                      >
                        <SendIcon />
                      </IconButton>
                      <IconButton
                        onClick={handleListen}
                        sx={{
                          borderRadius: '50%',
                          color: listening ? "red" : "white",
                          backgroundColor: listening ? '#1e1e1e' : 'orange',
                          "&:hover": {
                            backgroundColor: '#2d2d44',
                          },
                        }}
                        disabled={!file || loading}
                      >
                        {listening ? <MicOffIcon /> : <MicIcon />}
                      </IconButton>
                    </Stack>
                  </Paper>
                </Box>
              </>
            );
          }
          