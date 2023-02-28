#!/bin/sh

# This helper script converts all mp3 files in a given directory to a smaller version
# if they exceed a certain size threshold. It will set the kbit/s rate to a typically lower
# value in order to achieve that.
# Requirements: CLI tool 'lame' needs to be installed.
# Expected arguments: Source and target directory path.

SIZE_COMPACT_KB='400'

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

echo "Writing compacted audio from $1 to $2"
echo ""

# Example: lame -b 128 elegant_tern.mp3 elegant_tern_128.mp3
for file in "$SOURCE_DIR"/*.mp3; do
    size_kb=$(du -k "$file" | cut -f 1)
    name=$(basename "$file")

    if [ "$size_kb" -gt "$SIZE_COMPACT_KB" ]; then
        echo "$name / $size_kb KB / compacting"
        lame --silent -b 128 "$file" "$TARGET_DIR/$name"
    else
        echo "$name / $size_kb KB / no compacting"
        cp "$file" "$TARGET_DIR/$name"
    fi
done
