from ultralytics import YOLO
import cv2
import os
from pathlib import Path

# Configuration (Edit These If Needed)
INPUT_FOLDER = 'more ppl'         # Folder with your raw images
OUTPUT_FOLDER = 'output_annotated'    # Output folder for annotated images
LABELS_FOLDER = 'labels'              # Output folder for .txt YOLO labels
CONF_THRESHOLD = 0.01                  # Super low (1%) for max detections in crowds
IMG_EXTENSIONS = ['*.jpg', '*.jpeg','*.png']  # Supported input formats

# Load pre-trained YOLOv8 model (medium for better crowd detection; 'yolov8n.pt' for speed)
model = YOLO('yolov8m.pt')  # Better accuracy on groups—downloads auto

def save_yolo_labels(img_path, results, img_width, img_height):
    """
    Save detected person boxes as .txt file in YOLO format.
    """
    base_name = Path(img_path).stem
    txt_path = os.path.join(LABELS_FOLDER, f"{base_name}.txt")
    
    num_detections = 0
    with open(txt_path, 'w') as f:
        for r in results:
            if r.boxes is not None:
                for box in r.boxes:
                    if int(box.cls) == 0 and box.conf > CONF_THRESHOLD:  # Class 0 = 'person'
                        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                        # Normalize
                        center_x = ((x1 + x2) / 2) / img_width
                        center_y = ((y1 + y2) / 2) / img_height
                        width = (x2 - x1) / img_width
                        height = (y2 - y1) / img_height
                        f.write(f"0 {center_x:.6f} {center_y:.6f} {width:.6f} {height:.6f}\n")
                        num_detections += 1
    
    print(f"  -> Saved {num_detections} labels to: {txt_path}")
    return num_detections

def process_image(img_path, model):
    """
    Detect persons, draw simple bounding boxes with 'Person 1/2/3...' labels, add total count.
    """
    # Load image
    img = cv2.imread(str(img_path))
    if img is None:
        print(f"Error: Could not load {img_path}")
        return None, 0
    
    h, w = img.shape[:2]
    
    # Run detection (higher res for crowds)
    results = model(img_path, imgsz=1280, verbose=False)  # Bigger size = better small detections
    
    # Save labels first
    num_detections = save_yolo_labels(str(img_path), results, w, h)
    
    # Draw simple boxes + numbered labels
    person_id = 1  # Start numbering from 1
    for r in results:
        if r.boxes is not None:
            for box in r.boxes:
                if int(box.cls) == 0 and box.conf > CONF_THRESHOLD:
                    # Get box coords
                    x1, y1, x2, y2 = map(int, box.xyxy[0].cpu().numpy())
                    
                    # Simple green bounding box
                    cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    
                    # Label: "Person 1" above box (no conf, simple text)
                    label = f'Person {person_id}'
                    cv2.putText(img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                    
                    person_id += 1  # Next number
    
    
    
    return img, num_detections

def main():
    """
    A-Z: Process all images, generate annotated JPGs + .txt labels.
    """
    # Create folders
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)
    os.makedirs(LABELS_FOLDER, exist_ok=True)
    
    # Get images
    image_paths = []
    for ext in IMG_EXTENSIONS:
        image_paths.extend(Path(INPUT_FOLDER).glob(ext))
        image_paths.extend(Path(INPUT_FOLDER).glob(ext.upper()))
    
    if not image_paths:
        print(f"No images in '{INPUT_FOLDER}'. Add files!")
        return
    
    print(f"Found {len(image_paths)} images. Processing with YOLOv8m (crowd-optimized)...")
    total_persons = 0
    
    # Process each
    for i, img_path in enumerate(image_paths, 1):
        print(f"Processing {i}/{len(image_paths)}: {img_path.name}")
        
        annotated_img, count = process_image(img_path, model)
        
        if annotated_img is not None:
            base_name = Path(img_path).stem
            output_ext = Path(img_path).suffix  # Preserve original extension (e.g., '.png' or '.jpeg')
            output_path = os.path.join(OUTPUT_FOLDER, f"{base_name}{output_ext}")
            cv2.imwrite(output_path, annotated_img)
    
            print(f"  -> Annotated image saved: {output_path}")
            print(f"  -> Detected {count} persons (conf > {CONF_THRESHOLD})")
    
            total_persons += count
        else:
            print(f"  -> Skipped")
    
    # Summary
    print(f"\n=== DONE! ===")
    print(f"Processed {len(image_paths)} images.")
    print(f"Total persons: {total_persons}")
    print(f"Outputs: {OUTPUT_FOLDER} (JPGs with Person 1/2/3 boxes)")
    print(f"Labels: {LABELS_FOLDER} (.txt files)")
    print("\nFor low detections: Review output JPGs, fix misses manually if needed, then train custom model!")

# Run
if __name__ == "__main__":
    main()