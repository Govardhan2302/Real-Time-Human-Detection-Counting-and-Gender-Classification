import React from "react";

export default function Insights({ stats }) {
  return (
    <div>
      <h5 className="mb-3">Insights & Metrics</h5>

      <div className="row g-3">
        <div className="col-12 col-md-12">
          <div className="d-flex gap-2">
            <div className="card flex-fill p-3">
              <small className="text-muted">Total Images Processed</small>
              <div className="h4 mb-0">{stats.processed ?? "—"}</div>
              <small className="text-muted">Last 30 days</small>
            </div>

            <div className="card flex-fill p-3">
              <small className="text-muted">Model Accuracy</small>
              <div className="h4 mb-0">{stats.accuracy ?? "—"}</div>
              <small className="text-muted">Measured on test sets</small>
            </div>

            <div className="card flex-fill p-3">
              <small className="text-muted">Avg Inference Time</small>
              <div className="h4 mb-0">{stats.time ?? "—"}</div>
              <small className="text-muted">per image</small>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-3 p-3">
        <h6 className="mb-2">Model breakdown</h6>
        <table className="table table-sm">
          <tbody>
            <tr>
              <td>Detection model</td>
              <td>YOLOv8</td>
              <td>Fast person detection</td>
            </tr>
            <tr>
              <td>Gender classifier</td>
              <td>DeepFace (ArcFace)</td>
              <td>Face crop → embedding → classification</td>
            </tr>
            <tr>
              <td>Avg inference (GPU)</td>
              <td>~100–200 ms</td>
              <td>Depends on hardware</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
