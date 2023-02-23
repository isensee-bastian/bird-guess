#!/bin/sh

SIZE_COMPACT_STRONG_KB='1000'
SIZE_COMPACT_MEDIUM_KB='500'

SOURCE_DIR="$1"
TARGET_DIR="$2"

if [ ! -d "$SOURCE_DIR" ]; then
    echo "Source dir $1 does not exist"
    exit 1
fi
if [ ! -d "$TARGET_DIR" ]; then
    echo "Target dir $2 does not exist"
    exit 1
fi

echo "Writing compacted images from $1 to $2"

# Example: convert -resize 25% -quality 80% american_coot.jpg american_coot_25.jpg
for file in "$SOURCE_DIR"/*.jpg; do
    size_kb=$(du -k "$file" | cut -f 1)
    name=$(basename "$file")

    if [ "$size_kb" -gt "$SIZE_COMPACT_STRONG_KB" ]; then
        echo "$name / $size_kb KB / strong compacting"
        convert -resize 25% -quality 80% "$file" "$TARGET_DIR/$name"
    elif [ "$size_kb" -gt "$SIZE_COMPACT_MEDIUM_KB" ]; then
        echo "$name / $size_kb KB / medium compacting"
        convert -quality 80% "$file" "$TARGET_DIR/$name"
    else
        echo "$name / $size_kb KB / no compacting"
        cp "$file" "$TARGET_DIR/$name"
    fi
done