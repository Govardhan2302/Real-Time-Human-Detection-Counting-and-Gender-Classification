from ultralytics import YOLO
import cv2
model = YOLO('yolov8m.pt')
# The 'person' class is at index 0 in the COCO dataset
PERSON_CLASS_ID = 0
image_path = 'img1.jpg'
img = cv2.imread(image_path)

# Run the model on the image, specifying the person class and a confidence threshold
results = model(source=img, classes=[PERSON_CLASS_ID], conf=0.1, iou=0.6)
# The 'results' object is a list, typically with one element for a single image input
detected_boxes = results[0].boxes
person_count = len(detected_boxes)

# Loop through the detected bounding boxes to draw on the image
for box in detected_boxes:
    x1, y1, x2, y2 = box.xyxy[0].int().tolist()
    confidence = box.conf[0].item()

    # Draw the bounding box
    cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)

    # Add a label with the confidence score
    label = f'Person: {confidence:.2f}'
    cv2.putText(img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
import cv2

# Add the total person count to the image
cv2.putText(img, f'Total People: {person_count}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

# Display the result
from google.colab.patches import cv2_imshow
cv2_imshow(img)
print(f"Total persons are: {person_count}")
cv2.waitKey(0)
cv2.destroyAllWindows()