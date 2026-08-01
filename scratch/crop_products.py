import os
from PIL import Image

output_dir = r"c:\Users\HP\Downloads\anonym-—-anonyme-empire\public\images\products"

# Define model items per page (pages 3 to 23)
# Pages 3 to 23 contain models 001 to 211.
# Usually 10 products per page (2 columns x 5 rows), except page 23 which has 5 items.

page_models = {
    3:  [(1, 100, 300, 580, 580), (2, 100, 470, 580, 750), (3, 100, 610, 580, 890), (4, 100, 750, 580, 1030),
         (5, 580, 140, 1140, 420), (6, 580, 280, 1140, 560), (7, 580, 410, 1140, 690), (8, 580, 540, 1140, 820), (9, 580, 690, 1140, 970)],
}

# Let's inspect image dimensions
sample_img = Image.open(os.path.join(output_dir, "page_3.png"))
w, h = sample_img.size
print(f"Page dimensions: {w}x{h}")

# Generically crop items on pages 3 to 23
# Left col items: (col 0), Right col items: (col 1)
# 5 rows per page.
# Row y-ranges approx:
# Row 0: 0.12*h to 0.29*h
# Row 1: 0.29*h to 0.46*h
# Row 2: 0.46*h to 0.63*h
# Row 3: 0.63*h to 0.80*h
# Row 4: 0.80*h to 0.97*h

model_counter = 1
for page_num in range(3, 24):
    img_path = os.path.join(output_dir, f"page_{page_num}.png")
    if not os.path.exists(img_path):
        continue
    img = Image.open(img_path)
    
    # 5 rows x 2 cols
    row_height = h * 0.165
    margin_top = h * 0.12
    col_width = w * 0.45
    left_margin = w * 0.05
    right_margin = w * 0.50
    
    for row in range(5):
        for col in range(2):
            if model_counter > 211:
                break
            
            x1 = int(left_margin if col == 0 else right_margin)
            y1 = int(margin_top + row * row_height)
            x2 = int(x1 + col_width)
            y2 = int(y1 + row_height)
            
            # Crop image
            cropped = img.crop((x1, y1, x2, y2))
            crop_path = os.path.join(output_dir, f"model-{model_counter:03d}.jpg")
            cropped.convert("RGB").save(crop_path, quality=92)
            model_counter += 1

print(f"Cropped up to model-{model_counter-1:03d}")
