import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
from datetime import datetime

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app)  # allow cross-origin during dev

@app.route('/api/test-images', methods=['GET'])
def test_images():
    # return sample images metadata (frontend can replace)
    samples = [
        {"id":1, "name":"Office Group", "url":"https://via.placeholder.com/800x400?text=Office+Group"},
        {"id":2, "name":"Classroom", "url":"https://via.placeholder.com/800x400?text=Classroom"},
        {"id":3, "name":"Event Crowd", "url":"https://via.placeholder.com/800x400?text=Event+Crowd"}
    ]
    return jsonify(samples)

@app.route('/api/analyze/upload', methods=['POST'])
def analyze_upload():
    """
    Accepts multipart/form-data with 'image' file field.
    This stub saves the file and returns a fake detection response. Replace with model inference later.
    """
    if 'image' not in request.files:
        return jsonify({"error":"No image part"}), 400
    f = request.files['image']
    if f.filename == '':
        return jsonify({"error":"Empty filename"}), 400

    ts = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"{ts}_{f.filename}"
    path = os.path.join(UPLOAD_FOLDER, filename)
    f.save(path)

    # Optionally open and re-save to ensure valid image
    try:
        im = Image.open(path)
        im.verify()
    except Exception as e:
        return jsonify({"error":"Invalid image"}), 400

    # FAKE detections (demo)
    detections = [
        {"id":1, "box":[60,40,120,200], "confidence":0.98, "gender":"Male"},
        {"id":2, "box":[220,58,110,190], "confidence":0.95, "gender":"Female"}
    ]

    # Return processed_image as served from backend (same uploaded file)
    processed_url = f"/uploads/{filename}"

    resp = {
        "processed_image": processed_url,
        "detections": detections,
        "counts": {"total": len(detections), "male": 1, "female": 1}
    }
    return jsonify(resp)

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/api/insights')
def insights():
    # Example metrics
    return jsonify({
        "processed": 1254,
        "accuracy": "97%",
        "time": "~120 ms"
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
