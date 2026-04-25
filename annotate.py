import cv2
import os
import glob
from pathlib import Path

# === Configuration ===
IMAGE_FOLDER = 'raw images'      # Folder containing your 304 original images
LABELS_FOLDER = 'labels'         # Folder to save YOLO .txt files
CLASS_NAME = 'person'            # Your object class
IMG_EXTENSIONS = ['*.jpg', '*.jpeg', '*.png']  # Supported formats

# === Globals for mouse events ===
drawing = False
ix, iy = -1, -1
boxes = []
img = None
current_img_path = None

# === Mouse Callback ===
def mouse_callback(event, x, y, flags, param):
    global ix, iy, drawing, img, boxes
    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
        ix, iy = x, y
    elif event == cv2.EVENT_MOUSEMOVE and drawing:
        temp_img = img.copy()
        cv2.rectangle(temp_img, (ix, iy), (x, y), (0, 255, 0), 2)
        cv2.imshow('Annotation', temp_img)
    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        x1, y1 = min(ix, x), min(iy, y)
        x2, y2 = max(ix, x), max(iy, y)
        boxes.append((x1, y1, x2, y2))
        for box in boxes:
            cv2.rectangle(img, (box[0], box[1]), (box[2], box[3]), (0, 255, 0), 2)
            cv2.putText(img, f'{CLASS_NAME} {len(boxes)}', (box[0], box[1]-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        cv2.imshow('Annotation', img)

# === Normalize to YOLO format ===
def normalize_coords(box, img_width, img_height):
    x1, y1, x2, y2 = box
    center_x = (x1 + x2) / 2 / img_width
    center_y = (y1 + y2) / 2 / img_height
    width = (x2 - x1) / img_width
    height = (y2 - y1) / img_height
    return f"0 {center_x:.6f} {center_y:.6f} {width:.6f} {height:.6f}"

# === Save label file ===
def save_labels(image_path, boxes_list):
    base_name = Path(image_path).stem
    txt_path = os.path.join(LABELS_FOLDER, f"{base_name}.txt")
    with open(txt_path, 'w') as f:
        for box in boxes_list:
            norm_line = normalize_coords(box, img.shape[1], img.shape[0])
            f.write(norm_line + '\n')
    print(f"✅ Saved labels for {base_name}: {len(boxes_list)} boxes")

# === Annotation Loop ===
def annotate_all_images():
    global img, boxes, current_img_path

    os.makedirs(LABELS_FOLDER, exist_ok=True)

    # Collect image paths once (avoid duplicates)
    image_paths = set()
    for ext in IMG_EXTENSIONS:
        image_paths.update(glob.glob(os.path.join(IMAGE_FOLDER, ext)))
        image_paths.update(glob.glob(os.path.join(IMAGE_FOLDER, ext.upper())))
    image_paths = sorted(list(image_paths))

    if not image_paths:
        print(f"⚠️ No images found in '{IMAGE_FOLDER}'. Check folder and extensions.")
        return

    print(f"🖼 Found {len(image_paths)} total images.")
    print(f"📂 Saving YOLO labels to '{LABELS_FOLDER}'")
    print(f"➡️ Skipping already-labeled images automatically!\n")

    for i, img_path in enumerate(image_paths, 1):
        base_name = Path(img_path).stem
        label_path = os.path.join(LABELS_FOLDER, f"{base_name}.txt")

        # Skip if label already exists
        if os.path.exists(label_path):
            print(f"⏭ Skipping already labeled image: {base_name}")
            continue

        img = cv2.imread(img_path)
        if img is None:
            print(f"⚠️ Could not load {img_path}. Skipping.")
            continue

        boxes = []
        cv2.namedWindow('Annotation')
        cv2.setMouseCallback('Annotation', mouse_callback)

        print(f"\n--- Image {i}/{len(image_paths)}: {os.path.basename(img_path)} ---")
        print("🖱 Instructions:")
        print("  • Drag with Left Click → Draw box around person.")
        print("  • Press 's' → Save and go to next image.")
        print("  • Press 'r' → Reset all boxes for this image.")
        print("  • Press 'q' → Quit early.\n")

        while True:
            cv2.imshow('Annotation', img)
            key = cv2.waitKey(1) & 0xFF

            if key == ord('s'):  # Save and next
                if boxes:
                    save_labels(img_path, boxes)
                else:
                    print("⚠️ No boxes drawn, skipping save.")
                    cv2.destroyWindow('Annotation')
                    break

            elif key == ord('r'):  # Reset boxes
                boxes = []
                img = cv2.imread(img_path)
                print("🔄 Boxes reset!")

            elif key == ord('d') or key == 83:  # Skip manually (D or → key)
                print("⏭ Image skipped manually.")
                cv2.destroyWindow('Annotation')
                break

            elif key == ord('q'):  # Quit
                print("🚪 Quitting early. Unsaved images skipped.")
                cv2.destroyAllWindows()
                return


    print("\n✅ Annotation complete!")
    print(f"📁 All label files saved in '{LABELS_FOLDER}' folder.")
    print("➡️ Next: Move your images/labels into 'custom_dataset/images/train' and 'val' (80/20 split).")

# === Run ===
if __name__ == "__main__":
    annotate_all_images()