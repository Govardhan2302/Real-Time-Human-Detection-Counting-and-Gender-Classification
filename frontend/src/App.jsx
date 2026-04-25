import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Insights from './components/Insights';

// Placeholder SVG images
const SAMPLE_IMAGES = [
  { id:1, name: 'Office Group', src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><rect width="100%" height="100%" fill="#eef2ff"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#475569" font-size="20">Office Group</text></svg>' },
  { id:2, name: 'Classroom', src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><rect width="100%" height="100%" fill="#fff7ed"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#475569" font-size="20">Classroom</text></svg>' },
  { id:3, name: 'Event Crowd', src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><rect width="100%" height="100%" fill="#ecfccb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#475569" font-size="20">Event Crowd</text></svg>' }
];

export default function App(){
  const [previewSrc, setPreviewSrc] = useState(null);
  const [samples] = useState(SAMPLE_IMAGES);
  const [loading, setLoading] = useState(false);
  const [stats] = useState({ processed: 1254, accuracy: '97%', time: '~120 ms' });
  const [fileForUpload, setFileForUpload] = useState(null);

  function handleUpload(file){
    if(!file) return;
    setFileForUpload(file);
    const reader = new FileReader();
    reader.onload = (e)=> setPreviewSrc(e.target.result);
    reader.readAsDataURL(file);
  }

  async function handleAnalyze(){
    if(!previewSrc){ alert('Please upload or choose an image first'); return; }
    setLoading(true);
    // Demo: call backend endpoint (example)
    try {
      // If you have a backend, uncomment below and adjust URL
      /*
      const fd = new FormData();
      fd.append('image', fileForUpload || dataURLtoFile(previewSrc, 'capture.jpg'));
      const res = await fetch('http://localhost:5000/api/analyze/upload', {
        method: 'POST',
        body: fd
      });
      const json = await res.json();
      // use json.processed_image or json.detections to update UI
      setPreviewSrc(json.processed_image);
      */
      await new Promise(r => setTimeout(r, 900)); // fake
      alert('Demo: analysis complete (fake result). Replace call with real backend endpoint.');
    } catch (err) {
      console.error(err);
      alert('Error analyzing image. Check backend.');
    }
    setLoading(false);
  }

  async function handleOpenCamera(){
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ video:true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      const ok = window.confirm('Capture a frame from your camera? Click OK to capture.');
      if(ok){
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreviewSrc(dataUrl);
        setFileForUpload(null); // captured image not as File
      }
      stream.getTracks().forEach(t=> t.stop());
    }catch(err){
      console.error(err);
      alert('Could not access camera. Check permissions.');
    }
  }

  function handleUseSample(img){
    setPreviewSrc(img.src);
    setFileForUpload(null);
  }

  return (
    <div>
      <Header />
      <Hero onUpload={handleUpload} onOpenCamera={handleOpenCamera} onAnalyze={handleAnalyze} previewSrc={previewSrc} loading={loading} />
      <Gallery samples={samples} onUse={handleUseSample} />
      <Insights stats={stats} />

      <section id="about" className="container mt-4 mb-5">
        <div className="card p-3">
          <h5>About</h5>
          <p>This UI works with a Flask backend that should serve endpoints such as <code>/api/analyze/upload</code> and return an annotated image and JSON detections.</p>
          <p><b>Project:</b> Real-Time Human Detection, Counting and Gender Classification using Yolo and DeepFace</p>
        </div>
      </section>

      <footer className="container text-center text-muted py-4 mt-4">
        Project: <strong>Real-Time Human Detection, Counting and Gender Classification using Yolo and DeepFace</strong>
      </footer>
    </div>
  );
}
