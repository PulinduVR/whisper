import React, { useState, useRef } from 'react';
import axios from 'axios';

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorderRef.current.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');

      try {
        const res = await axios.post('http://localhost:8000/transcribe', formData);
        setTranscript(res.data.text);
      } catch (err) {
        console.error(err);
        setTranscript('Error transcribing audio.');
      }
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="p-4">
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div>
        <h3>Transcript:</h3>
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default AudioRecorder;
