from ultralytics import YOLO
import torch

# Check if GPU or CPU is available
device ='cpu'
print(f"Training will continue on: {device}")

# Load the last saved model checkpoint
model = YOLO(r'F:\Minor Project\Project\runs\detect\custom_human_train2\weights\last.pt')

# Resume training
model.train(
    data=r'F:\Minor Project\Project\data.yaml',  # your data config path
    epochs=70,        # total epochs you planned for
    resume=True,       # resumes from last.pt automatically
    device=device,
    imgsz=640,
    batch=4,
    patience=20,
    name='custom_human_train_resume'
)

print("✅ Training resumed successfully!")
