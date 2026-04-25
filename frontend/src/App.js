import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import Insights from "./components/Insights";
import DetectionsModal from "./components/DetectionsModal";
import img11 from './assets/img11.jpg';
import img12 from './assets/img12.jpg';
import img13 from './assets/img13.jpg';

const SAMPLE_IMAGES = [
  { id: 1, name: 'Office Group', src: img11 },
  { id: 2, name: 'Classroom',     src: img12 },
  { id: 3, name: 'Event Crowd',   src: img13 },
];



export default function App() {
  const [previewSrc, setPreviewSrc] = useState(null);
  const [samples] = useState(SAMPLE_IMAGES);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    processed: 1254,
    accuracy: "97%",
    time: "~120 ms",
  });
  const [detections, setDetections] = useState([]); // array of detection objects
  const [showDetectionsModal, setShowDetectionsModal] = useState(false);

  // store selected image file when uploading
  const [fileForUpload, setFileForUpload] = useState(null);

  function handleUpload(file) {
    if (!file) return;
    setFileForUpload(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewSrc(e.target.result);
    reader.readAsDataURL(file);
    setDetections([]); // clear previous detections
  }

  async function handleAnalyze() {
    if (!previewSrc) {
      alert("Please upload or choose an image first");
      return;
    }
    setLoading(true);

    try {
      // If you have a backend, uncomment and adjust this block:
      /*
      const form = new FormData();
      if (fileForUpload) {
        form.append('image', fileForUpload);
      } else {
        const blob = dataURLtoBlob(previewSrc);
        form.append('image', blob, 'capture.jpg');
      }
      const res = await fetch('http://localhost:5000/api/analyze/upload', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error('Server error');
      const json = await res.json();
      setPreviewSrc(json.processed_image.startsWith('http') ? json.processed_image : `http://localhost:5000${json.processed_image}`);
      setDetections(json.detections || []);
      setStats(prev => ({ ...prev, processed: prev.processed + 1 }));
      */

      // Demo / fake response (remove after integrating backend)
      await new Promise((r) => setTimeout(r, 900));
      const fakeDetections = [
        { id: 1, box: [60, 40, 120, 200], confidence: 0.98, gender: "Male" },
        { id: 2, box: [220, 58, 110, 190], confidence: 0.95, gender: "Female" },
      ];
      setDetections(fakeDetections);
      setShowDetectionsModal(true);
    } catch (err) {
      console.error(err);
      alert("Error analyzing image. Check backend and CORS.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const confirmCapture = window.confirm(
        "Camera opened. Click OK to capture a frame, Cancel to close camera."
      );
      if (confirmCapture) {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setPreviewSrc(dataUrl);
        setFileForUpload(null);
        setDetections([]);
      }

      // stop camera
      stream.getTracks().forEach((t) => t.stop());
    } catch (err) {
      console.error(err);
      alert("Could not access camera. Check permissions.");
    }
  }

  function handleUseSample(img) {
    setPreviewSrc(img.src);
    setFileForUpload(null);
    setDetections([]);
  }

  return (
    <div>
      <Header />

      <main className="container my-4">
        {/* Hero with central controls */}
        <Hero
          onUpload={handleUpload}
          onOpenCamera={handleOpenCamera}
          onAnalyze={handleAnalyze}
          previewSrc={previewSrc}
          loading={loading}
          detections={detections}
          onOpenDetections={() => setShowDetectionsModal(true)}
        />

        {/* Test Images: full width gallery */}
        <section className="mb-4">
          <Gallery samples={samples} onUse={handleUseSample} />
        </section>

        {/* INSIGHTS: moved here, full-width and centered */}
        <section className="mb-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-10">
                <Insights stats={stats} />
              </div>
            </div>
          </div>
        </section>

        {/* About (follows Insights) */}
        <section id="about" className="mt-4 mb-5">
          <div className="card p-3">
            <h5>About</h5>
            <p>
              This web application showcases an AI-powered system capable of detecting humans, counting the number of people, and predicting gender from images. Built using YOLO (You Only Look Once) for object detection and DeepFace for gender classification, the system provides fast, reliable analysis suitable for a variety of environments.
            </p>
            <p>Users can upload images or capture photos through their camera, and the backend processes the input to generate detection boxes, gender labels, and summary statistics. The interface is designed to be clean, modern, and user-friendly, making advanced computer vision accessible to everyone.
            </p>
            <p>
            This project demonstrates how modern machine learning models can be integrated seamlessly into interactive web applications to solve real-world problems such as surveillance analytics, event monitoring, attendance estimation, and demographic studies..
            </p>
            
          </div>
        </section>
      </main>

      <footer className="container text-center text-muted py-4 mt-4">
        Project: <strong>Real-Time Human Detection, Counting and Gender Classification using Yolo and DeepFace</strong>
      </footer>

      <DetectionsModal
        show={showDetectionsModal}
        onClose={() => setShowDetectionsModal(false)}
        detections={detections}
      />
    </div>
  );
}

/* Optional helper (if you use it in analyze flow)
function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}
*/
