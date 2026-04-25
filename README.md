<h1 align="center">🤖 Real-Time Human Detection & Gender Classification</h1>

<h3 align="center">Powered by YOLOv8 + DeepFace (ArcFace)</h3>

<p align="center">
  🚀 AI-based system for detecting humans, counting individuals, and classifying gender in real-time.
</p>

<hr>

<h2>📌 About the Project</h2>

<p>
This project focuses on building an intelligent system that automatically detects humans, counts individuals, 
and classifies gender from images using deep learning techniques.
</p>

<p>
It integrates <b>YOLOv8</b> for real-time human detection and <b>DeepFace (ArcFace)</b> for accurate gender classification, 
achieving high performance and up to <b>97% accuracy</b>.
</p>

<hr>

<h2>✨ Key Features</h2>

<ul>
  <li>👤 Real-Time Human Detection</li>
  <li>🔢 Automatic Person Counting</li>
  <li>🚻 Gender Classification (Male / Female)</li>
  <li>🎯 Bounding Box Visualization</li>
  <li>📊 Confidence Score Display</li>
  <li>⚡ Fast & Efficient Processing</li>
</ul>

<hr>

<h2>🏗️ System Architecture</h2>

<pre>
Input Image / Camera
        ↓
YOLOv8 Model (Human Detection)
        ↓
Face Extraction (MTCNN)
        ↓
DeepFace (ArcFace Model)
        ↓
Gender Classification
        ↓
Final Output (Bounding Boxes + Counts)
</pre>

<p><i>As described in your report system design (Chapter 3).</i></p>

<hr>

<h2>🧩 Modules</h2>

<ul>
  <li><b>Image Input Module</b> – Accepts images for processing</li>
  <li><b>Human Detection Module</b> – Detects persons using YOLOv8</li>
  <li><b>Face Extraction Module</b> – Extracts face regions</li>
  <li><b>Gender Classification Module</b> – Uses DeepFace (ArcFace)</li>
  <li><b>Counting Module</b> – Counts total persons</li>
  <li><b>Visualization Module</b> – Displays final output</li>
</ul>

<hr>

<h2>⚙️ Technologies Used</h2>

<ul>
  <li>🐍 Python</li>
  <li>🔥 PyTorch</li>
  <li>📦 YOLOv8 (Ultralytics)</li>
  <li>🧠 DeepFace (ArcFace)</li>
  <li>📷 OpenCV</li>
  <li>📊 NumPy, Pandas</li>
  <li>🌐 Flask (Backend API)</li>
  <li>⚛️ React.js (Frontend)</li>
  <li>🎨 Bootstrap</li>
  <li>🗄️ MySQL Database</li>
</ul>

<hr>

<h2>📁 Project Structure</h2>

<pre>
Project1/
│
├── backend/
├── frontend/
├── custom_dataset/ (ignored)
├── models/
├── scripts/
├── requirements.txt
└── README.md
</pre>

<hr>

<h2>🚀 How It Works</h2>

<ol>
  <li>User uploads image or captures via camera</li>
  <li>YOLOv8 detects humans in image</li>
  <li>Faces are extracted from detected persons</li>
  <li>DeepFace classifies gender</li>
  <li>Results displayed with bounding boxes and labels</li>
</ol>

<hr>

<h2>📊 Output</h2>

<pre>
Total Persons: 10
Male: 6
Female: 4

P1 → Male
P2 → Female
...
</pre>

<p>✔️ Bounding boxes + labels shown on image</p>

<hr>

<h2>⚠️ Limitations</h2>

<ul>
  <li>❌ Faces not visible → gender may fail</li>
  <li>❌ Low light affects accuracy</li>
  <li>❌ No tracking (duplicate counting possible)</li>
</ul>

<hr>

<h2>🚀 Future Improvements</h2>

<ul>
  <li>🎯 Real-time video & CCTV integration</li>
  <li>🧠 Age & emotion detection</li>
  <li>📍 Object tracking (DeepSORT)</li>
  <li>☁️ Cloud deployment (AWS / GCP)</li>
</ul>

<hr>

<h2>📦 Requirements</h2>

<pre>
flask
opencv-python
torch
torchvision
ultralytics
deepface
numpy
pandas
</pre>

<hr>

<h2>👨‍💻 Authors</h2>

<ul>
  <li>Govardhan Siva Sai Bellamkonda</li>
  <li>Team Members (as per project report)</li>
</ul>

<hr>

<h2 align="center">⭐ If you like this project, give it a star!</h2>
