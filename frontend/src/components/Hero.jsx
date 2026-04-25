import React from "react";
import PreviewWithOverlay from "./PreviewWithOverlay";

export default function Hero({
  onUpload,
  onOpenCamera,
  onAnalyze,
  previewSrc,
  loading,
  detections,
  onOpenDetections,
}) {
  return (
    <section className="card mb-4 shadow-sm">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-7">
            <h2 className="h4">Real-Time Human Detection & Gender Classification</h2>
            <p className="text-muted mb-3">
              Upload an image or use your camera. Backend: YOLO (detection) + DeepFace (gender).
            </p>

            <div className="d-flex flex-wrap gap-2 align-items-center">
              <label className="btn btn-outline-secondary btn-sm mb-1">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => onUpload(e.target.files && e.target.files[0])}
                />
              </label>

              <button className="btn btn-outline-primary btn-sm mb-1" onClick={onOpenCamera}>
                Open Camera
              </button>

              <button
                className="btn btn-success btn-sm mb-1"
                onClick={onAnalyze}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" /> Analyzing...
                  </>
                ) : (
                  "Analyze"
                )}
              </button>

              <button
                className="btn btn-outline-info btn-sm mb-1"
                onClick={onOpenDetections}
                disabled={!detections || detections.length === 0}
              >
                View Detections
              </button>
            </div>

            <div className="text-muted small mt-3">
              Model Info: YOLOv8 for fast detection · DeepFace (ArcFace) for gender classification.
            </div>
          </div>

          <div className="col-md-5">
            <PreviewWithOverlay src={previewSrc} detections={detections} />
          </div>
        </div>
      </div>
    </section>
  );
}
