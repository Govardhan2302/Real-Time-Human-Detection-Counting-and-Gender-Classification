from ultralytics import YOLO
import torch
import logging
import os
os.environ["YOLO_VERBOSE"] = "True"

# Set up logging to capture all details
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load pre-trained model
model = YOLO('yolov8l.pt')
logger.info("Model loaded successfully")

# Train with absolute path to data.yaml
try:
    results = model.train(
        data=r'F:\Minor Project\Project\data.yaml',  # Use raw string for path safety
        epochs=70,
        imgsz=640,
        batch=4,  # Reduced from 16 to avoid memory issues
        name='custom_human_train',
        device='cpu',  # Correct type (int for GPU ID)
        patience=20,
        save=True,
        plots=True
    )
    logger.info("Training completed successfully")

except Exception as e:
    logger.error(f"Training failed with error: {e}", exc_info=True)
    raise

# Results
print("\n✅ Training done! Key metrics:")
try:
    # Use results.metrics if available (latest YOLOv8 structure)
    if hasattr(results, "metrics") and results.metrics is not None:
        print(f"Best mAP50: {results.metrics.get('metrics/mAP50(B)', 'N/A')}")
    else:
        print("Metrics not found — check the 'runs/detect/custom_human_train/results.csv' file for details.")
except Exception as e:
    print(f"Error accessing metrics: {e}")

print("Best model saved at: runs/detect/custom_human_train/weights/best.pt")
