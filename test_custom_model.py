from ultralytics import YOLO

# Load your trained YOLO model
model = YOLO(r"F:\Minor Project\Project\runs\detect\custom_human_train2\weights\best.pt")

# Set your custom image path
image_path = r"F:\Minor Project\Project\test"  # change this to your image

# Run prediction with custom confidence
results = model.predict(source=image_path, conf=0.3, save=True, show=True)

# 'conf=0.1' means detections with confidence > 10% will be shown
# 'save=True' saves output image in 'runs/detect/predict' folder
# 'show=True' opens result window (optional)
