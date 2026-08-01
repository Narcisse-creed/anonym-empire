with open(r'src/components/AdminPortalModal.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Line numbers (0-indexed) of the duplicate blocks to remove
# First occurrence stays at lines 138-160 (0-indexed)
# Duplicates are at lines 162-184, 186-208, 210-232 (0-indexed)
total_lines = len(lines)
print(f'Total lines: {total_lines}')

# Find all start lines of handleMultipleImageUpload
starts = []
for i, line in enumerate(lines):
    if 'const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>)' in line:
        starts.append(i)
print(f'Found {len(starts)} occurrences at lines {[s+1 for s in starts]}')

# Find the end of each function (the line with "  };")
ends = []
for start in starts:
    for j in range(start, min(start + 30, total_lines)):
        if lines[j].strip() == '};' and j > start:
            ends.append(j)
            break
print(f'End lines (1-indexed): {[e+1 for e in ends]}')

# Remove duplicates: keep first, remove the rest
# Process in reverse order so line numbers don't shift
to_remove = []
for i in range(1, len(starts)):
    # Include the blank line before the function (start-1) and the function itself
    block_start = starts[i] - 1  # include preceding blank line
    block_end = ends[i]
    to_remove.append((block_start, block_end))

# Remove in reverse order
for block_start, block_end in reversed(to_remove):
    del lines[block_start:block_end+1]

with open(r'src/components/AdminPortalModal.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print(f'REMOVED {len(starts)-1} duplicates')
print('CLEANUP_OK')
