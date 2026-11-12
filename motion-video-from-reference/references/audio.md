# Audio, rendering and the final mix

You cannot hear. Every audio decision is verified by measurement (levels, timing, waveform pictures), and you tell the user so and ask them to listen.

## Sound effects

The template synthesises effects with Web Audio, so there are no files or licences. `cues()` returns a list of `[time, kind, options]`; `schedule()` turns them into sound on any audio context; the page plays them live and `sfxWav()` exports the same track for the MP4.

- Time every cue from the animation's own numbers: a pop when a bubble's entrance starts, a thud when something lands (entrance start plus most of its duration), a whoosh starting slightly before a wipe's midpoint.
- Keep them soft and short. Typical kinds: `in` and `out` pops for incoming and outgoing messages, `tick` for small elements, `key` for typing, `swish` under headlines, `whoosh` for transitions and camera moves, `thud` for landings, `chime` for the brand reveal and the call to action, `note` for sequences that climb a scale.
- Vary pitch across a run of similar sounds, and pan slightly left and right, so repetition does not grate.
- Less is more under a voice-over: drop the swishes and lower the whole track.

Look at the result: `ffmpeg -i sfx.wav -filter_complex "showwavespic=s=1900x300:scale=sqrt" -frames:v 1 wave.png`. No single kind should tower over the rest.

## Music

The user supplies the track and is responsible for its licence; remind them once. Use the opening section unless it starts with silence (check with `silencedetect`). Trim to the video length, lower it, fade in quickly and fade out over the last 2 to 3 seconds:

```powershell
ffmpeg -y -t 50 -i music-source.mp3 -af "volume=0.25,afade=t=in:d=0.3,afade=t=out:st=47.5:d=2.5" -ar 48000 -b:a 160k assets/music.mp3
```

A bed at about 25% of a normally mastered track sits well under a voice. Without a voice-over it can be louder (around 50%).

## Voice-over

1. **Script to the beats.** One line per beat, short enough to finish inside it at about 2.5 words per second. Show the script and get approval before recording, because recording costs the user credits.
2. **Record.** Use whichever text-to-speech service the user has. Sign-in is the user's step. Put each line in its own paragraph so the take has clear pauses.
3. **Download** only with the user's go-ahead.
4. **Cut and place.** Find pauses with `silencedetect` (`n=-35dB:d=0.25`), match them to the script lines by expected length, then lay each piece on the timeline at its beat. Mix onto a silent base so the timeline starts at zero:

```
anullsrc=r=48000:cl=stereo,atrim=0:DUR[base];
[0:a]aresample=48000,aformat=channel_layouts=stereo,asplit=N[i0]...;
[i0]atrim=START:END,asetpts=PTS-STARTPTS,afade=t=in:d=0.02,adelay=MS:all=1[o0]; ...
[base][o0]...amix=inputs=N+1:normalize=0:duration=first[vo]
```

   Without the base, the mix starts at the first piece and everything lands early. Re-run `silencedetect` on the result and confirm each line starts where you intended. If the last line overruns the end, speed that piece up a few percent with `atempo` rather than cutting it.

Notes from using ElevenLabs in a browser tool: type the script one line at a time with a separate Enter key press between lines (typing text that contains newlines in one go can desync its editor); confirm the character counter matches the script length before generating; it produces two takes per generation.

## Render and mix

Frames (about a quarter of a second each at 1080p):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File <skill>\scripts\capture.ps1 -Html C:\path\video.html -Out C:\temp\frames -Fps 60 -End 50
```

Encode:

```powershell
ffmpeg -y -framerate 60 -i C:\temp\frames\f_%05d.png -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -movflags +faststart video.mp4
```

Sound-effects track:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File <skill>\scripts\audio.ps1 -Html C:\path\video.html -Out C:\temp\sfx.wav
```

Mix (voice clearly on top, then effects, then music), without re-encoding the picture:

```powershell
ffmpeg -y -i video.mp4 -i sfx.wav -i assets/music.mp3 -i vo-timed.wav -filter_complex "[1:a]volume=3dB[s];[3:a]highpass=f=80,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=120,volume=10dB[v];[s][2:a][v]amix=inputs=3:normalize=0,volume=2dB,alimiter=limit=0.89:level=false[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 224k -t 50 -movflags +faststart final.mp4
```

Adjust the gains from measurements, not from these numbers: the raw effects track peaks low and a raw speech take is often around -24 LUFS.

Targets to measure with `-af volumedetect,ebur128`:

- overall about -14 to -16 LUFS, peak below -1 dB
- voice about 10 dB or more above the music
- effects audible but below the voice

Final checks on the file: `ffprobe` shows the expected frame count and duration and both streams; a contact sheet pulled from the MP4 (`select` + `tile`) looks right.

FFmpeg may be installed but not on the shell's PATH (winget installs under `%LOCALAPPDATA%\Microsoft\WinGet\Packages`); search for `ffmpeg.exe` before asking to install it.
