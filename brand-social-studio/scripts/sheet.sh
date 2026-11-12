#!/bin/bash
# [brand-social-studio] Example from MET City; needs sheets/font.ttf (copy C:/Windows/Fonts/arial.ttf).
# Frame-by-frame study sheets: for each video given, grabs 24 evenly spaced frames (timestamp burned in)
# and tiles them 6x4 into sheets/<name>.jpg. Portrait videos get taller tiles.
# Usage: bash sheet.sh <video>...   (run from research/)
cd "$(dirname "$0")"
mkdir -p sheets
for v in "$@"; do
  name=$(basename "${v%.*}")
  [ -f "sheets/$name.jpg" ] && { echo "skip $name"; continue; }
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$v")
  w=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$v")
  h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$v")
  if [ "$h" -gt "$w" ]; then tw=200; th=356; else tw=320; th=180; fi
  step=$(node -e "console.log(Math.max(0.5,($dur-0.3)/24).toFixed(3))")
  ffmpeg -loglevel error -y -i "$v" -vf "fps=1/$step,scale=$tw:$th:force_original_aspect_ratio=decrease,pad=$tw:$th:(ow-iw)/2:(oh-ih)/2,drawtext=fontfile=sheets/font.ttf:text='%{pts\:hms}':x=3:y=3:fontsize=11:fontcolor=yellow:box=1:boxcolor=black@0.6,tile=6x4" -frames:v 1 "sheets/$name.jpg" && echo "ok $name ${dur%.*}s"
done
