import { useState } from 'react'
import './App.css'
import AudioRecorder from './AudioRecorder'

function App() {

  return (
    <>
      <div className="App">
      <h2>Voice to Text (Whisper)</h2>
      <AudioRecorder />
    </div>
    </>
  )
}

export default App
