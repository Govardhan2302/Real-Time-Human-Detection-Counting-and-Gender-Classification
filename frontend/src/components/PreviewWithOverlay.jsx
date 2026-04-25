import React, { useRef, useEffect, useState } from "react";

/*
  detections: [{id, box: [x,y,w,h], confidence, gender}, ...]
  Note: This overlay maps boxes to image dimensions by assuming boxes are in the
  same coordinate system as image natural size. If backend returns normalized
  boxes (0..1) you should scale accordingly.
*/

export default function PreviewWithOverlay({ src, detections }) {
  const containerRef = useRef();
  const imgRef = useRef();
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    function update() {
      setImgSize({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
    }
    img.addEventListener("load", update);
    update();
    return () => img.removeEventListener("load", update);
  }, [src]);

  return (
    <div ref={containerRef} style={{ position: "relative", minHeight: 200 }} className="border rounded overflow-hidden bg-light">
      {src ? (
        <>
          <img ref={imgRef} src={src} alt="preview" style={{ width: "100%", display: "block", height: "auto" }} />
          {/* overlay */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {detections &&
              detections.map((d) => {
                // if backend uses absolute pixel box: [x,y,w,h]
                const [x, y, w, h] = d.box;
                // compute percent positions based on image displayed size vs natural size
                const imgEl = imgRef.current;
                if (!imgEl || !imgEl.naturalWidth) return null;
                const displayWidth = imgEl.clientWidth;
                const displayHeight = imgEl.clientHeight;
                const scaleX = displayWidth / imgEl.naturalWidth;
                const scaleY = displayHeight / imgEl.naturalHeight;

                const left = x * scaleX;
                const top = y * scaleY;
                const width = w * scaleX;
                const height = h * scaleY;

                return (
                  <div
                    key={d.id}
                    style={{
                      position: "absolute",
                      left,
                      top,
                      width,
                      height,
                      border: "2px solid rgba(0,123,255,0.9)",
                      boxSizing: "border-box",
                      borderRadius: 6,
                      pointerEvents: "none",
                    }}
                  >
                    <div style={{ background: "rgba(0,123,255,0.9)", color: "#fff", fontSize: 12, padding: "2px 6px", borderTopLeftRadius: 6 }}>
                      {d.gender} · {(d.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      ) : (
        <div className="p-4 text-center text-muted">No image selected</div>
      )}
    </div>
  );
}
