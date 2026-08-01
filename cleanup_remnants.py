with open(r'src/components/AdminPortalModal.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Remove lines 162-176 (0-indexed: 161-175) which are remnants of the 3 duplicate function bodies
# Line 161 is blank (after line 161 which is "  };"), line 162 starts with "        reader.readAsDataURL(file);"
# We want to keep line 161 (the blank line after the first function's closing "};") and remove 162-176
del lines[161:176]

with open(r'src/components/AdminPortalModal.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('REMOVED remnants of 3 duplicate function bodies')
print('CLEANUP_OK')
