#!/bin/bash
# [brand-social-studio] Example from MET City; reads prompts.tsv (name<TAB>prompt) next to it.
# Makes one image per line of prompts.tsv with Codex, 5 at a time. Rules from the user's SKILL.md:
# spell every name exactly, no phone numbers, no logos or watermarks, a different look per project, real-looking.
cd "$(dirname "$0")"
# rules are in prompts.tsv (see posts.cjs)
make() {
  local name="$1" prompt="$2"
  mkdir -p "work/$name"; cd "work/$name"
  codex exec --skip-git-repo-check --sandbox workspace-write "Generate exactly one image. $prompt Save it as $name.png in the current folder. Reply with the file path only." < /dev/null > log.txt 2>&1
  [ -f "$name.png" ] && cp "$name.png" "../../$name.png" && echo "done $name" || echo "FAILED $name"
}
n=0
while IFS=$'\t' read -r name prompt; do
  [ -z "$name" ] && continue
  [ -f "$name.png" ] && { echo "skip $name"; continue; }
  make "$name" "$prompt" &
  n=$((n+1)); [ $((n % 5)) -eq 0 ] && wait
done < prompts.tsv
wait
echo ALL DONE
