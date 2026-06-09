# 🌳 Living Seasons Tree



---

# 📖 Inspiration





---

## Visual References




---

# ⚙️ Techniques

## Audio

Audio Input is broken into two main subcategories: **environmental sound effects** (controlled by environmentSFX.js) and **microphone-driven interaction** (controlled by audioMechanic.js)

* **Environmental Sound Effects**
    _ _Keeping in mind that certain browers require user input in order to begin audio playback, the inital tree growth does not automatically have sound effects, users must click "play backgound audio" or the spacebar to trigger playback_ _ 
    - Background environmental sound effects of rustling leaves increase the immersion and realism of the piece
    - Users can toggle on and off the rustling audio through a button that changes indicating text based on toggle 
    - A starting chime triggered on a spacebar click provides context for the restart and regeneration of the piece which then automatically leads into looping rustle sfx

* **Microphone Driven Interaction**
    - Microphone captured audio amplitude levels drive vertical "bouncing" movement of both petals and leaves after they have fallen to the ground
    - Both petals and leaves react to the same information recieved, but they translate the information differently. Information begins at the center of the screen for the petals and inversely the edges of the screen for the leaves
    - `p5.AudioIn` is used to capture microphone input 
    - `mic.connect(fft)` takes amplitude information recieved from mic and uses fast fourier transformation to break it down into further values. These values then create rectangles with heights that vary in response to live information. The petals and leaves then use the height of these corresponding rectangles as indicators for y-position movement
    - both petals and leaves use `lerp()` to ease into new y-positions
    - if background sfx toggle button is on or after users have pressed space, sfx will be picked up by mic - indicating to users (if they have not already) the functionality of mic input

---

## Time-based

The time-based mechanic controls how the scene changes over time.

Applications include:

* Day-night background colour cycle
* Smooth transitions using `lerpColor()`
* Tree growth controlled by `deltaTime`
* 5-second no-hover auto-blooming
* Connection with user input mechanic: hover interaction resets the auto-bloom timer
* Sun and moon movement based on cycle progress
* Time reset when the scene restarts

---

This mechanic uses `millis()` to track elapsed time. The background, tree growth, passive blooming, and sky objects all follow the same timing system.

The input mechanic detects when the user hovers near the tree. The time mechanic records that interaction time and waits 5 seconds before triggering passive blooming.

This helps the artwork feel like a living cycle rather than a static tree animation.

---

## Perlin noise and randomness

Perlin noise is used to simulate natural movement.

Applications include:

* Wind movement
* Petal drifting
* Leaf swaying

This creates smoother and more organic motion than purely random movement.

---

Random values are used for:

* Branch variation
* Flower placement
* Leaf placement
* Petal rotation
* Growth differences

This ensures every generated tree is unique.

---

## User input

The user input mechanic lets users interact directly with the tree using their mouse.

Applications include:

* Hovering over branches to trigger flowers to bloom near the cursor
* Clicking on a flower to break it apart into falling petals
* Pressing space to regenerate a new randomly shaped tree

This creates a responsive and living artwork where the user actively shapes
the growth and decay of the tree, rather than watching a passive animation.

---

The input mechanic connects with the other mechanics in the project:

* Hover blooming resets the time mechanic's auto-bloom timer
* Fallen petals accumulate on the ground and later react to audio input
* Space key also resets the background day-night cycle

Together these interactions form a continuous cycle of growth, bloom, and decay.

---


# 🎮 Interaction Instructions

## How to Experience the Artwork

1. Open the sketch.
2. Enable brower's microphone input.
3. Observe life cycle of tree throughout the day.
4. Toggle on and off background audio through indicating button.
5. Hover mouse over tree branches to grow additional flowers.
6. Click on flowers to turn them into falling petals.
7. Observe petals drifting naturally in the wind.
8. Use background sfx and/or mic input (user's vocals, music, claps, etc) to "re-animate" fallen leaves and petals.
9. Press SPACE to regenerate new tree and restart experience.

---

# 👥 Mechanic Ownership

| Team Member        | Mechanic                  | Description                                                                                                           |
| -----------        | ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Fabiana Fonseca    | Audio                     |  SFX to increase user immersion and mic input used to reanimate fallen petals and leaves.                                                                                                                    |
| Jiayi Hou          | Time-Based Events         |                                                                                                                       |
| Chunyu Zhao        | Perlin Noise & Randomness |                                                                                                                       |
| Guanghan Li        | User Input                |                                                                                                                       |

---

# 🤖 AI Acknowledgement

**Audio** - _Fabiana Fonseca_
Used Copilot within VSC to help smoothly connect rectangle height movement
to the corresponding class instances of fallingPetals and fallingLeaves, as 
well as to refine/debug playback button toggle.

**Time-Based** - _Jiayi Hou_


**Perlin Noise & Randomness** - _Chunyu Zhao_


**User Input** - _Guanghan Li_



---

# 📚 External References

## The Tree 

Source:
https://openprocessing.org

Used as inspiration for generative tree structures and recursive branch generation.

---

## Audio

Source:
https://www.youtube.com/watch?v=uk96O7N1Yo0
https://www.youtube.com/watch?v=2O3nm0Nvbi4
https://edstem.org/au/courses/31325/lessons/98500/slides/672004

Used as inspiration for audio reactive movement that could then by adapted by the falling petal and leaf instances.

---

## Time-based


---
## Perlin noise and randomness

---

## User input

---

# 📂 Project Structure

```text
project-folder
│
├── index.html
├── sketch.js
│
├── tree/
│   ├── tree.js
│   ├── branch.js
│
├── flowers/
│   ├── flower.js
│   ├── petal.js
│
├── leaves/
│   ├── leaf.js
│
├── audio/
│   ├── audioMechanic.js
│   ├── environmentalSFX.js
│
├── assets/
│   ├── StartingChime.mp3
│   ├── storegraphic-soft-wind-316392.mp3
│
└── README.md
```

---

# 🎥 Demonstration

## Live Demo

(Add GitHub Pages link here)

## Video Documentation

(Add YouTube or Vimeo link here)

---

