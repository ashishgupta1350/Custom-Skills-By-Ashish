# Craft: what makes it look premium

The difference between a premium motion piece and a slideshow is almost entirely in timing, restraint and consistency. Use the reference as the measure: if a choice here conflicts with what the reference does, follow the reference.

## Structure of every beat

Each beat has an entrance, a hold and an exit. Plan all three.

- **Entrance** takes 0.4 to 0.8 s. Elements arrive in a deliberate order, staggered 0.05 to 0.15 s apart, not all at once.
- **Hold** is long enough to read. Budget about 0.3 s per word plus 0.5 s, and never less than the reference gives a line of similar length.
- **Exit** is fast (0.2 to 0.35 s) and usually simpler than the entrance. Or cut hard, if the reference does.

No dead frames: something should always be settling, drifting or about to change. A gentle float or slow push-in during holds keeps a frame alive.

## Motion

- **Easing carries the feel.** Use a strong ease-out (`cubic-bezier(.16,1,.3,1)`) for things arriving, an overshoot (`cubic-bezier(.34,1.56,.64,1)`) for things popping, and ease-in for things leaving. Linear motion is for constant things only: marquees, progress bars, counters.
- **Animate from a meaningful place.** A reply bubble grows from its tail corner; a card comes from where the user's eye already is; an icon expands out of the word it belongs to.
- **Overlap actions.** The next element starts before the previous one has finished settling.
- **Use the camera.** Push in on the detail that matters, pull back to reveal context. A whole-scene scale of 1.0 to 1.4 with a chosen origin reads as a camera move.
- **Blur with speed.** A few pixels of blur fading out as text arrives, or as a scene leaves, hides the mechanical look of pure opacity fades.
- **One idea per transition.** Pick the reference's transition vocabulary (hard cuts, colour wipes, iris, zoom-through) and reuse it; do not add new kinds.

## Type and layout

- Size type for the frame, not for a web page. On a 1920x1080 stage, headlines are 100 to 170 px and the smallest readable text is about 30 px.
- Two typefaces at most, chosen to suit the product; tight letter-spacing on large bold type.
- Leave generous empty space. Premium pieces show one thing at a time.
- Keep a consistent colour system with roles: ground, ink, one accent. Decide when grounds swap and stick to it.
- Product UI must look real: correct proportions, plausible content, proper status bars, shadows that match one light direction.

## Consistency checks

- Same easing family, same stagger rhythm and same corner radii throughout.
- Elements never overlap by accident or run off the stage; check stills at the busiest moment of each beat.
- Text never changes while it is still being read.
- The first frame and the last three seconds are designed: the opening hooks without context, the end card holds still long enough to act on.

## Common ways it goes wrong

- Everything fades in at the same speed from the same direction.
- Too many words per beat; the viewer reads instead of watching.
- A story that explains features in a list instead of showing one moment of use per feature.
- Decorative effects the reference does not have: gradients, glows, particles.
- Phone mock-ups with text too small to read at video size; zoom the camera in or enlarge the UI.
- Invented statistics. Use illustrative demo content and say that it is illustrative.

## Building notes for the template

- Position with `left` / `top`; keep `transform` free for animation. Use the separate `translate`, `rotate` and `scale` properties for a second, independent motion (a float on top of a pop).
- Create an element's animations in time order. The helper gives the first animation on a property a backward fill (so the element starts hidden) and later ones a forward fill.
- Hide and show whole scenes with `show(scene, from, to)` rather than fading children individually.
- Measure before you scroll: for chat threads, compute how far the thread must move from each message's `offsetTop` after fonts load, instead of hard-coding distances.
- Flex containers swallow the spaces between inline word spans; keep split text inside a block element.
- Put every time value in the timeline section, in order, with a comment per beat.
