import fitz  # PyMuPDF
import os
import json

pdf_path = r"C:\Users\HP\Downloads\garde-2-1.pdf"
output_dir = r"c:\Users\HP\Downloads\anonym-—-anonyme-empire\public\images\products"
os.makedirs(output_dir, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")

# Render each page to image and save info
page_images = []
for i in range(len(doc)):
    page = doc[i]
    pix = page.get_pixmap(dpi=150)
    img_path = os.path.join(output_dir, f"page_{i+1}.png")
    pix.save(img_path)
    page_images.append(img_path)

print("Page rendering complete!")
