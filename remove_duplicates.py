import re

path = r'src/components/AdminPortalModal.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

func_block = '''  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      let processed = 0;
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          processed++;
          if (processed === files.length) {
            if (adminTab === 'add') {
              setFormData((prev) => ({ ...prev, images: [...(prev.images || []), ...newImages] }));
            } else if (editingProduct) {
              setEditingProduct((prev) => (prev ? { ...prev, images: [...(prev.images || []), ...newImages] } : null));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = '';
  };'''

count = text.count(func_block)
if count > 1:
    first_idx = text.find(func_block)
    remaining = text[first_idx + len(func_block):]
    while func_block in remaining:
        remaining = remaining.replace(func_block, '', 1)
    text = text[:first_idx + len(func_block)] + remaining
    print(f'REMOVED {count - 1} duplicates')
else:
    print('NO_DUPLICATES')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print('CLEANUP_OK')
